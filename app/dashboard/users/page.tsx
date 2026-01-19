import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import UsersTable from "@/app/ui/users/table";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { fetchFilteredUsers } from "@/app/lib/data";
import { AddUserButton } from "@/app/ui/users/buttons";

export const metadata: Metadata = {
    title: "Users | Acme Dashboard",
};

const ITEMS_PER_PAGE = 6;

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;

    const users = await fetchFilteredUsers(query);
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

    const paginatedUsers = users.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Users</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search users..." />
                <AddUserButton />
            </div>
            <Suspense
                key={query + currentPage}
                fallback={<InvoicesTableSkeleton />}
            >
                <UsersTable users={paginatedUsers} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
