// app/ui/customers/buttons.tsx
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { auth } from "@/auth";
import { deleteCustomer } from "@/app/lib/actions";
import { DeleteCustomerButton } from "./delete-customer-button";

export async function AddCustomerButton() {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        return null;
    }

    return (
        <Link
            href="/dashboard/customers/create"
            className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden md:block">Adicionar Cliente</span>
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
            className="rounded-lg border border-gray-700 p-2 hover:bg-gray-800 hover:border-gray-600 transition-all group"
            title="Editar cliente"
        >
            <PencilIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
        </Link>
    );
}

export async function DeleteCustomer({ id }: { id: string }) {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        return null;
    }

    return <DeleteCustomerButton id={id} deleteAction={deleteCustomer} />;
}
