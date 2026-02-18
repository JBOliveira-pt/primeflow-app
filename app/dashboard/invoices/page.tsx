// app/dashboard/invoices/page.tsx
import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages } from "@/app/lib/data";
import { Metadata } from "next";
import { formatCurrencyPTBR } from "@/app/lib/utils";

export const metadata: Metadata = {
    title: "Invoices | PrimeFlow Dashboard",
};

// Forçar renderização dinâmica
export const dynamic = "force-dynamic";

// Skeleton para o Search
function SearchSkeleton() {
    return (
        <div className="relative flex flex-1 max-w-md">
            <div className="w-full h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
    );
}

// Skeleton para Pagination
function PaginationSkeleton() {
    return (
        <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
    );
}

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchInvoicesPages(query);

    return (
        <div className="w-full min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
            <div className="flex flex-col w-full justify-between">
                <h1 className="text-xl text-center lg:text-start md:text-3xl font-bold text-gray-900 dark:text-white">
                    Faturas
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center lg:text-start">
                    Gerencie suas faturas
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Suspense fallback={<SearchSkeleton />}>
                    <Search placeholder="Buscar faturas..." />
                </Suspense>
                <CreateInvoice />
            </div>

            <Suspense
                key={query + currentPage}
                fallback={<InvoicesTableSkeleton />}
            >
                <Table query={query} currentPage={currentPage} />
            </Suspense>

            <div className="mt-5 flex w-full justify-center">
                <Suspense fallback={<PaginationSkeleton />}>
                    <Pagination totalPages={totalPages} />
                </Suspense>
            </div>
        </div>
    );
}
