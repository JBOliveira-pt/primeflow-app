"use server";

import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Helper function to check admin permissions
async function checkAdminPermission() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized: No session");
    }
    const userRole = (session.user as any).role;
    if (userRole !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }
}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer.",
    }),
    amount: z.coerce.number().gt(0, {
        message: "Please enter an amount greater than $0.",
    }),
    status: z.enum(["pending", "paid"], {
        invalid_type_error: "Please select an invoice status.",
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

const CustomerFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, { message: "Please enter a first name." }),
    lastName: z
        .string()
        .trim()
        .min(1, { message: "Please enter a last name." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    imageUrl: z
        .string()
        .trim()
        .optional()
        .refine(
            (value) =>
                !value ||
                value.startsWith("http://") ||
                value.startsWith("https://") ||
                value.startsWith("/"),
            {
                message: "Use a full URL or a path starting with /.",
            },
        ),
});

const CreateCustomer = CustomerFormSchema;
const UpdateCustomer = CustomerFormSchema;

export type CustomerState = {
    errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        imageUrl?: string[];
    };
    message?: string | null;
};

async function persistUpload(file: File | null) {
    if (!file || file.size === 0) {
        return null;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const extension = path.extname(file.name) || ".bin";
    const filename = `${crypto.randomUUID()}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    await fs.writeFile(filepath, buffer);

    return `/uploads/${filename}`;
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}

export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Invoice.",
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0];

    // Insert data into the database
    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to Create Invoice.",
        };
    }
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    // Check admin permission
    try {
        await checkAdminPermission();
    } catch (error) {
        return {
            message: "Unauthorized: Only admins can update invoices.",
        };
    }

    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Invoice.",
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    } catch (error) {
        return { message: "Database Error: Failed to Update Invoice." };
    }

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
    // Check admin permission
    try {
        await checkAdminPermission();
    } catch (error) {
        throw new Error("Unauthorized: Only admins can delete invoices.");
    }

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
        throw new Error("Database Error: Failed to delete invoice.");
    }

    revalidatePath("/dashboard/invoices");
}

export async function createCustomer(
    prevState: CustomerState,
    formData: FormData,
) {
    try {
        await checkAdminPermission();
    } catch (error) {
        return {
            message: "Unauthorized: Only admins can create customers.",
        };
    }

    const validatedFields = CreateCustomer.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        imageUrl: formData.get("imageUrl") || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing or invalid fields. Failed to create customer.",
        };
    }

    const imageFile = formData.get("imageFile");
    const uploadedPath =
        imageFile instanceof File ? await persistUpload(imageFile) : null;

    const { firstName, lastName, email, imageUrl } = validatedFields.data;
    const fullName = `${firstName} ${lastName}`.trim().replace(/\s+/g, " ");
    const normalizedImageUrl = imageUrl?.trim() || null;
    const finalImageUrl = uploadedPath || normalizedImageUrl;

    if (!finalImageUrl) {
        return {
            message: "Please provide a photo (upload a file or set a URL).",
        };
    }

    try {
        await sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (gen_random_uuid(), ${fullName}, ${email}, ${finalImageUrl})
    `;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to create customer.",
        };
    }

    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
}

export async function updateCustomer(
    id: string,
    prevState: CustomerState,
    formData: FormData,
) {
    try {
        await checkAdminPermission();
    } catch (error) {
        return {
            message: "Unauthorized: Only admins can update customers.",
        };
    }

    const validatedFields = UpdateCustomer.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        imageUrl: formData.get("imageUrl") || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing or invalid fields. Failed to update customer.",
        };
    }

        const imageFile = formData.get("imageFile");
        const uploadedPath =
                imageFile instanceof File ? await persistUpload(imageFile) : null;

        const { firstName, lastName, email, imageUrl } = validatedFields.data;
        const fullName = `${firstName} ${lastName}`.trim().replace(/\s+/g, " ");
        const normalizedImageUrl = imageUrl?.trim() || null;
        const finalImageUrl = uploadedPath || normalizedImageUrl;

        if (!finalImageUrl) {
                return {
                        message: "Please provide a photo (upload a file or set a URL).",
                };
        }

    try {
        await sql`
      UPDATE customers
            SET name = ${fullName}, email = ${email}, image_url = ${finalImageUrl}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to update customer." };
    }

    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
    try {
        await checkAdminPermission();
    } catch (error) {
        throw new Error("Unauthorized: Only admins can delete customers.");
    }

    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
    } catch (error) {
        console.error(error);
        throw new Error(
            "Database Error: Failed to delete customer. Remove related invoices first.",
        );
    }

    revalidatePath("/dashboard/customers");
}
