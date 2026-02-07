// app/ui/users/buttons.tsx
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { auth } from "@/auth";
import { deleteUser } from "@/app/lib/actions";

export async function AddUserButton() {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        return null;
    }

    return (
        <Link
            href="/dashboard/users/create"
            className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden md:block">Adicionar Usuário</span>
        </Link>
    );
}

export async function UpdateUser({ id }: { id: string }) {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        return null;
    }

    return (
        <Link
            href={`/dashboard/users/${id}/edit`}
            className="rounded-lg border border-gray-700 p-2 hover:bg-gray-800 hover:border-gray-600 transition-all group"
            title="Editar usuário"
        >
            <PencilIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
        </Link>
    );
}

export async function DeleteUser({ id }: { id: string }) {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        return null;
    }

    const deleteUserWithId = deleteUser.bind(null, id);

    return (
        <form action={deleteUserWithId}>
            <button
                type="submit"
                className="rounded-lg border border-gray-700 p-2 hover:bg-red-500/10 hover:border-red-500/50 transition-all group"
                title="Deletar usuário"
                onClick={(e) => {
                    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
                        e.preventDefault();
                    }
                }}
            >
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
            </button>
        </form>
    );
}