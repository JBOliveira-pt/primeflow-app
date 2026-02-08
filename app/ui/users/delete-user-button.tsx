// app/ui/users/delete-user-button.tsx
"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-gray-700 p-2 hover:bg-red-500/10 hover:border-red-500/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Deletar usuário"
        >
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
        </button>
    );
}

export function DeleteUserButton({
    id,
    deleteAction,
}: {
    id: string;
    deleteAction: (id: string) => Promise<void>;
}) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!confirm("Tem certeza que deseja deletar este usuário?")) {
            return;
        }

        await deleteAction(id);
    };

    return (
        <form onSubmit={handleSubmit}>
            <SubmitButton />
        </form>
    );
}
