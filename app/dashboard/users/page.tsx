import { fetchUsers } from "@/app/lib/data";
import { AddUserButton } from "@/app/ui/users/buttons";
import UsersTable from "@/app/ui/users/table";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Users } from "lucide-react";

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
    };
}) {
    const query = searchParams?.query || "";
    const users = await fetchUsers();

    return (
        <div className="w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-xl text-center lg:text-start md:text-3xl font-bold text-white">Usuários</h1>
                        <p className="text-sm text-gray-400">
                            Gerencie os usuários do sistema
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Add - Envolver Search em Suspense */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <Suspense fallback={<SearchSkeleton />}>
                    <Search placeholder="Buscar usuários..." />
                </Suspense>
                <AddUserButton />
            </div>

            {/* Table */}
            <Suspense fallback={<InvoicesTableSkeleton />}>
                <UsersTable users={users} />
            </Suspense>
        </div>
    );
}

// Skeleton para o Search
function SearchSkeleton() {
    return (
        <div className="relative flex flex-1 max-w-md">
            <div className="w-full h-10 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
    );
}