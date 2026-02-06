import { fetchCardData } from "@/app/lib/data";
import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
};

export default async function CardWrapper() {
    const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    } = await fetchCardData();

    return (
        <>
            {/* NOTE: Uncomment this code in Chapter 9 */}

            <Card
                title="Collected"
                value={totalPaidInvoices}
                type="collected"
            />
            <Card title="Pending" value={totalPendingInvoices} type="pending" />
            <Card
                title="Total Invoices"
                value={numberOfInvoices}
                type="invoices"
            />
            <Card
                title="Total Customers"
                value={numberOfCustomers}
                type="customers"
            />
        </>
    );
}

export function Card({
    title,
    value,
    type,
}: {
    title: string;
    value: number | string;
    type: "invoices" | "customers" | "pending" | "collected";
}) {
    const Icon = iconMap[type];

    return (
        <div className="bg-gray-900 border-gray-800 text-white p-10 text-xl rounded-xl">
                <div className="mb-5 flex gap-2">
                    {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
                    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
                </div>
                     
                <p className={`text-2xl font-bold`}>{value}</p>
        </div>
    );
}
