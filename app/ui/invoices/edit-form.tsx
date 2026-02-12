// app/ui/invoices/edit-form.tsx
"use client";

import { CustomerField, InvoiceForm } from "@/app/lib/definitions";
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
    CalendarIcon,
    XMarkIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useActionState } from "react";
import { updateInvoice, State } from "@/app/lib/actions";

export default function EditInvoiceForm({
    invoice,
    customers,
}: {
    invoice: InvoiceForm;
    customers: CustomerField[];
}) {
    const initialState: State = { message: null, errors: {} };
    const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
    const [state, formAction] = useActionState(
        updateInvoiceWithId,
        initialState,
    );

    return (
        <form action={formAction}>
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8">
                {/* Form Header */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <PencilIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Editar Fatura
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                ID: {invoice.id.slice(0, 8)}...
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer Name */}
                <div className="mb-6">
                    <label
                        htmlFor="customer"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Cliente
                    </label>
                    <div className="relative">
                        <select
                            id="customer"
                            name="customerId"
                            className="peer block w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-10 pr-10 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                            defaultValue={invoice.customer_id}
                            aria-describedby="customer-error"
                        >
                            <option value="" disabled className="text-gray-500">
                                Selecione um cliente
                            </option>
                            {customers.map((customer) => (
                                <option
                                    key={customer.id}
                                    value={customer.id}
                                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <svg
                                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <div
                        id="customer-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.customerId &&
                            state.errors.customerId.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-400"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Invoice Amount */}
                <div className="mb-6">
                    <label
                        htmlFor="amount"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Valor da Fatura
                    </label>
                    <div className="relative">
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            defaultValue={invoice.amount}
                            placeholder="Digite o valor em R$"
                            className="peer block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            aria-describedby="amount-error"
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 peer-focus:text-blue-400 transition-colors" />
                    </div>
                    <div
                        id="amount-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.amount &&
                            state.errors.amount.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-400"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Invoice Date */}
                <div className="mb-6">
                    <label
                        htmlFor="date"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Data da Fatura
                    </label>
                    <div className="relative">
                        <input
                            id="date"
                            name="date"
                            type="date"
                            defaultValue={invoice.date}
                            className="peer block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-10 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all dark:[color-scheme:dark]"
                            required
                            aria-describedby="date-error"
                        />
                        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div id="date-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.date &&
                            state.errors.date.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-400"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Invoice Status */}
                <fieldset className="mb-6">
                    <legend className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status da Fatura
                    </legend>
                    <div className="space-y-3">
                        <label
                            htmlFor="pending"
                            className="flex items-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 cursor-pointer hover:border-yellow-500/50 hover:bg-yellow-50 dark:hover:bg-gray-800/80 transition-all group has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-500/10"
                        >
                            <input
                                id="pending"
                                name="status"
                                type="radio"
                                value="pending"
                                defaultChecked={invoice.status === "pending"}
                                className="h-4 w-4 cursor-pointer border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0"
                                aria-describedby="status-error"
                            />
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                    Pendente
                                </span>
                            </div>
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                                Aguardando pagamento
                            </span>
                        </label>

                        <label
                            htmlFor="paid"
                            className="flex items-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 cursor-pointer hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-gray-800/80 transition-all group has-[:checked]:border-green-500 has-[:checked]:bg-green-500/10"
                        >
                            <input
                                id="paid"
                                name="status"
                                type="radio"
                                value="paid"
                                defaultChecked={invoice.status === "paid"}
                                className="h-4 w-4 cursor-pointer border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                            />
                            <div className="flex items-center gap-2">
                                <CheckIcon className="h-5 w-5 text-green-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                    Pago
                                </span>
                            </div>
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-600 dark:text-green-400 rounded-full">
                                Pagamento confirmado
                            </span>
                        </label>
                    </div>
                    <div
                        id="status-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.status &&
                            state.errors.status.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-400"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </fieldset>

                {/* Error Message */}
                {state.message && (
                    <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/50 p-4">
                        <p className="text-sm text-red-400">{state.message}</p>
                    </div>
                )}
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex items-center justify-end gap-4">
                <Link
                    href="/dashboard/invoices"
                    className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                >
                    <XMarkIcon className="h-4 w-4" />
                    Cancelar
                </Link>
                <Button type="submit">
                    <PencilIcon className="h-4 w-4" />
                    Salvar Alterações
                </Button>
            </div>
        </form>
    );
}
