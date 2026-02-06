import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { fetchLatestInvoices } from "@/app/lib/data";

export default async function LatestInvoices() {
    // Remove props
    const latestInvoices = await fetchLatestInvoices();

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`text-3xl lg:text-xl font-bold mb-5`}>
                Latest Invoices
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl p-5 bg-gray-900 border-gray-800 p-4">
                {/* NOTE: Uncomment this code in Chapter 7 */}
                    {latestInvoices.map((invoice, i) => {
                        return (
                            <div
                                key={invoice.id}
                                className={clsx(
                                    "flex flex-row items-center justify-between py-4",
                                    {
                                        "border-t": i !== 0,
                                    },
                                )}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={invoice.image_url}
                                        alt={`${invoice.name}'s profile picture`}
                                        className="mr-4 rounded-full"
                                        style={{
                                            objectFit: "cover",
                                            aspectRatio: "1 / 1",
                                        }}
                                        width={32}
                                        height={32}
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {invoice.name}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {invoice.email}
                                        </p>
                                    </div>
                                </div>
                                
                                <p className="flex flex-col items-end text-right">
                                    <span className="text-xs text-gray-500 md:text-sm">
                                        {invoice.date}
                                    </span>
                                    <span
                                        className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                    >
                                        {invoice.amount}
                                    </span>
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">
                        Updated just now
                    </h3>
                </div>
            </div>
    );
}
