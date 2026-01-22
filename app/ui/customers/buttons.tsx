import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { auth } from "@/auth";
import { deleteCustomer } from "@/app/lib/actions";

export async function AddCustomerButton() {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        return null;
    }

    return (
        <Link
            href="/dashboard/customers/create"
            className="flex h-10 items-center rounded-lg bg-[#141828] px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141828] dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
        >
            <span className="hidden md:block">Add Customer</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export async function UpdateCustomer({ id }: { id: string }) {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        return null;
    }

    return (
        <Link
            href={`/dashboard/customers/${id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export async function DeleteCustomer({ id }: { id: string }) {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        return null;
    }

    const deleteCustomerWithId = deleteCustomer.bind(null, id);

    return (
        <form action={deleteCustomerWithId}>
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
