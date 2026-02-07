// app/dashboard/page.tsx
import CardWrapper from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana, openSans } from "@/app/ui/fonts";
import { Suspense } from "react";
import {
    RevenueChartSkeleton,
    LatestInvoicesSkeleton,
    CardsSkeleton,
} from "@/app/ui/skeletons";

export default async function Page() {
    return (
        <main className="bg-gray-950 p-6">
            {/* Header da página */}
            <div className="mb-8">
                <h2 className="text-xl text-center lg:text-start md:text-2xl font-bold text-white">
                    Visão Geral
                </h2>
                <p className="text-sm text-center lg:text-start md:text-base text-gray-400">
                    Bem-Vindo de volta ao seu controle
                </p>
            </div>

            {/* Cards KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>

            {/* Gráficos */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>

                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}