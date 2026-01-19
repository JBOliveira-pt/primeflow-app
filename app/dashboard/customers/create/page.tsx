import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import CreateCustomerForm from "@/app/ui/customers/create-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        redirect("/dashboard/customers");
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Customers", href: "/dashboard/customers" },
                    {
                        label: "Add Customer",
                        href: "/dashboard/customers/create",
                        active: true,
                    },
                ]}
            />
            <CreateCustomerForm />
        </main>
    );
}
