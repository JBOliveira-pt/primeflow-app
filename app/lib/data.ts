import postgres from "postgres";
import {
    Customer,
    CustomerField,
    CustomersTableType,
    FormattedCustomersTable,
    InvoiceForm,
    InvoicesTable,
    LatestInvoiceRaw,
    Revenue,
    User,
} from "./definitions";
import { formatCurrency, formatDateToLocal } from "./utils";
import { auth } from "@clerk/nextjs/server";

export async function fetchUsers() {
    try {
        const data = await sql<User[]>`
            SELECT 
                id,
                name,
                email,
                image_url,
                role
            FROM users
            ORDER BY name ASC
        `;

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch users.");
    }
}

export async function fetchFilteredUsers(query: string) {
    try {
        const data = await sql<User[]>`
            SELECT 
                id,
                name,
                email,
                image_url,
                role
            FROM users
            WHERE
                name ILIKE ${`%${query}%`} OR
                email ILIKE ${`%${query}%`} OR
                role ILIKE ${`%${query}%`}
            ORDER BY name ASC
        `;

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch users.");
    }
}

// Helper para pegar organization_id da sessão
async function getOrganizationId(): Promise<string> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Fetch organization_id from database using clerk_user_id
    try {
        const user = await sql<
            { organization_id: string }[]
        >`SELECT organization_id FROM users WHERE clerk_user_id = ${userId}`;
        const orgId = user[0]?.organization_id;

        if (!orgId) {
            throw new Error("No organization found for user");
        }

        return orgId;
    } catch (error) {
        console.error("Failed to fetch organization:", error);
        throw new Error("Failed to fetch user organization");
    }
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const DEFAULT_AVATAR = "https://avatar.vercel.sh/placeholder.png";

export async function fetchRevenue() {
    try {
        // Artificially delay a response for demo purposes.
        // Don't do this in production :)

        console.log("Fetching revenue data...");
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const data = await sql<Revenue[]>`SELECT * FROM revenue`;

        console.log("Data fetch completed after 3 seconds.");

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch revenue data.");
    }
}

export async function fetchLatestInvoices() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const data = await sql<
            (Omit<LatestInvoiceRaw, "image_url"> & {
                customer_id: string;
                image_url: string | null;
                status: "pending" | "paid";
            })[]
        >`
            SELECT 
                invoices.amount, 
                invoices.date,
                invoices.status,
                customers.name, 
                customers.id as customer_id, 
                customers.email, 
                customers.image_url,
                invoices.id
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            ORDER BY invoices.date DESC
            LIMIT 5`;

        const latestInvoices = data.map((invoice) => ({
            ...invoice,
            image_url: invoice.image_url || DEFAULT_AVATAR,
            date: formatDateToLocal(invoice.date),
            amount: formatCurrency(invoice.amount),
        }));
        return latestInvoices;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch the latest invoices.");
    }
}

export async function fetchCardData() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        // You can probably combine these into a single SQL query
        // However, we are intentionally splitting them to demonstrate
        // how to initialize multiple queries in parallel with JS.
        const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
        const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
        const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

        const data = await Promise.all([
            invoiceCountPromise,
            customerCountPromise,
            invoiceStatusPromise,
        ]);

        const numberOfInvoices = Number(data[0][0].count ?? "0");
        const numberOfCustomers = Number(data[1][0].count ?? "0");
        const totalPaidInvoices = formatCurrency(data[2][0].paid ?? "0");
        const totalPendingInvoices = formatCurrency(data[2][0].pending ?? "0");

        return {
            numberOfCustomers,
            numberOfInvoices,
            totalPaidInvoices,
            totalPendingInvoices,
        };
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch card data.");
    }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const invoices = await sql<
            (Omit<InvoicesTable, "image_url"> & {
                customer_id: string;
                image_url: string | null;
                created_by: string | null;
            })[]
        >`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url,
        invoices.customer_id,
        invoices.created_by
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

        // Map to add fallback for missing images
        const invoicesWithImage = invoices.map((invoice) => ({
            ...invoice,
            image_url: invoice.image_url || DEFAULT_AVATAR,
        }));

        return invoicesWithImage;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch invoices.");
    }
}

export async function fetchInvoicesPages(query: string) {
    try {
        const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

        const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of invoices.");
    }
}

export async function fetchInvoiceById(id: string) {
    try {
        const data = await sql<(InvoiceForm & { created_by?: string })[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status,
        invoices.date,
        invoices.created_by
      FROM invoices
      WHERE invoices.id = ${id};
    `;

        const invoice = data.map((invoice) => ({
            ...invoice,
            // Convert amount from cents to dollars
            amount: invoice.amount / 100,
        }));
        return invoice[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch invoice.");
    }
}

export async function fetchCustomers() {
    const organizationId = await getOrganizationId();

    try {
        const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      WHERE organization_id = ${organizationId}
      ORDER BY name ASC
    `;

        return customers;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch all customers.");
    }
}

export async function fetchFilteredCustomers(
    query: string,
): Promise<FormattedCustomersTable[]> {
    const organizationId = await getOrganizationId();

    try {
        // O banco retorna números
        const data = await sql<CustomersTableType[]>`
            SELECT
              customers.id,
              customers.name,
              customers.email,
              customers.image_url,
              customers.created_by,
              COUNT(invoices.id) AS total_invoices,
              COALESCE(SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END), 0) AS total_pending,
              COALESCE(SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END), 0) AS total_paid
            FROM customers
            LEFT JOIN invoices ON customers.id = invoices.customer_id
            WHERE 
              customers.organization_id = ${organizationId}
              AND (customers.name ILIKE ${`%${query}%`} OR customers.email ILIKE ${`%${query}%`})
            GROUP BY customers.id, customers.name, customers.email, customers.image_url, customers.created_by
            ORDER BY customers.name ASC
        `;
        const formattedCustomers: FormattedCustomersTable[] = data.map(
            (customer) => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                image_url: customer.image_url || DEFAULT_AVATAR,
                created_by: customer.created_by,
                total_invoices: Number(customer.total_invoices),
                total_pending: formatCurrency(customer.total_pending),
                total_paid: formatCurrency(customer.total_paid),
            }),
        );

        return formattedCustomers;
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error("Failed to fetch customer table.");
    }
}

export async function fetchCustomerById(id: string) {
    try {
        const data = await sql<Customer[]>`
      SELECT id, name, email, image_url, created_by
      FROM customers
      WHERE id = ${id}
    `;

        const customer = data[0];
        return customer || undefined;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch customer.");
    }
}

export async function fetchUserById(id: string) {
    try {
        const data = await sql<User[]>`
      SELECT id, name, email, password, role, image_url
      FROM users
      WHERE id = ${id}
    `;

        return data[0] || undefined;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch user.");
    }
}
