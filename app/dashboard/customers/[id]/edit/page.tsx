import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditCustomerForm from "@/app/ui/customers/edit-form";
import { fetchCustomerById } from "@/app/lib/data";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        redirect("/dashboard/customers");
    }

    const customer = await fetchCustomerById(id);

    if (!customer) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Customers", href: "/dashboard/customers" },
                    {
                        label: "Edit Customer",
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditCustomerForm customer={customer} />
        </main>
    );
}
