import { fetchUsers } from "@/app/lib/data";
import { AddUserButton } from "@/app/ui/users/buttons";
import UsersTable from "@/app/ui/users/table";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Users } from "lucide-react";

export default async function Page() {
    const users = await fetchUsers();

    return (
        <div className="w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                
                        <div className="flex flex-col">
                            <h1 className="text-xl text-center lg:text-start md:text-3xl font-bold text-white">Usuários</h1>
                            <p className="text-sm text-gray-400">
                                Gerencie os usuários do sistema
                            </p>
                        </div>

            </div>

            {/* Search and Add */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <Search placeholder="Buscar usuários..." />
                <AddUserButton />
            </div>

            {/* Table */}
            <Suspense fallback={<InvoicesTableSkeleton />}>
                <UsersTable users={users} />
            </Suspense>
        </div>
    );
}