"use client";

import { Bell, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/button";
import { formatCurrency } from "@/app/lib/utils";
import { useRouter } from "next/dist/client/components/navigation";

interface Invoice {
    id: string;
    customer_name: string;
    amount: number;
    date: string;
    status: "pending" | "paid";
}

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    

    useEffect(() => {
        fetchPendingInvoices();
    }, []);

    const fetchPendingInvoices = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/invoices/pending");
            const data = await response.json();
            setPendingInvoices(data.slice(0, 5)); // Últimas 5 faturas pendentes
        } catch (error) {
            console.error("Failed to fetch pending invoices:", error);
        } finally {
            setLoading(false);
        }
    };

       const handleViewAllInvoices = () => {
        setIsOpen(false);
        router.push("/dashboard/invoices");
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {/* Badge de notificação */}
                {pendingInvoices.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </Button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Faturas Pendentes
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {pendingInvoices.length} fatura{pendingInvoices.length !== 1 ? "s" : ""} aguardando pagamento
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                                Carregando...
                            </div>
                        ) : pendingInvoices.length > 0 ? (
                            pendingInvoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {invoice.customer_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(invoice.date).toLocaleDateString("pt-BR")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(invoice.amount)}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1 text-yellow-600 dark:text-yellow-500">
                                                <Clock size={12} />
                                                <span className="text-xs">Pendente</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Nenhuma fatura pendente
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {pendingInvoices.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                            <Button
                                variant="outline"
                                className="w-full text-xs cursor-pointer"
                                onClick={handleViewAllInvoices}
                            >
                                Ver todas as faturas
                            </Button>
                            
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop para fechar o dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}