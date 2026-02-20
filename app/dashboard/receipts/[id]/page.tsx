import { Metadata } from "next";
import { fetchReceiptDetail } from "@/app/lib/receipts-data";
import ReceiptEditForm from "@/app/ui/receipts/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";

export const metadata: Metadata = {
    title: "Receipt | PrimeFlow Dashboard",
};

export const dynamic = "force-dynamic";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const receipt = await fetchReceiptDetail(id);

    return (
        <main className="p-5">
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Recibos", href: "/dashboard/receipts" },
                    {
                        label: "Visualização",
                        href: `/dashboard/receipts/${id}`,
                        active: true,
                    },
                ]}
            />
            <ReceiptEditForm receipt={receipt} canSend={false} />
        </main>
    );
}
