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
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Add User</span>
            <PlusIcon className="h-5 md:ml-4" />
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
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
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
                className="rounded-md border p-2 hover:bg-gray-100"
            >
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
