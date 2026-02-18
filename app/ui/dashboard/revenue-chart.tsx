"use client";

import { formatCurrencyPTBR, generateYAxis } from "@/app/lib/utils";
import { CalendarIcon, TrendingUp, ArrowUpRight } from "lucide-react";
import { Revenue } from "@/app/lib/definitions";
import { useState, useEffect } from "react";

interface RevenueChartProps {
    revenue: Revenue[];
}

export default function RevenueChart({ revenue: allRevenue }: RevenueChartProps) {
    const [selectedMonths, setSelectedMonths] = useState<3 | 5 | 12>(12);
    const [revenue, setRevenue] = useState<Revenue[]>([]);

    useEffect(() => {
        // Filtrar os dados baseado nos meses selecionados
        const filtered = allRevenue.slice(-selectedMonths);
        setRevenue(filtered);
    }, [selectedMonths, allRevenue]);

    const chartHeight = 350;
    const { yAxisLabels, topLabel } = generateYAxis(revenue);

    if (!revenue || revenue.length === 0) {
        return (
            <div className="w-full md:col-span-4">
                <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 h-[450px] flex items-center justify-center">
                    <p className="text-gray-500">Nenhum dado disponível</p>
                </div>
            </div>
        );
    }

    // Calcular o total e a média
    const totalRevenue = revenue.reduce((sum, month) => sum + month.revenue, 0);
    const averageRevenue = totalRevenue / revenue.length;

    // Pegar o último mês e calcular crescimento
    const lastMonth = revenue[revenue.length - 1];
    const previousMonth = revenue[revenue.length - 2];
    const growth = previousMonth
        ? (
              ((lastMonth.revenue - previousMonth.revenue) /
                  previousMonth.revenue) *
              100
          ).toFixed(1)
        : 0;

    return (
        <div className="w-full md:col-span-4">
            {/* Header com título e métricas */}
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Receita Recente
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Últimos {selectedMonths} meses
                    </p>
                </div>

                {growth != 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10">
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                            {growth}%
                        </span>
                    </div>
                )}
            </div>

            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                {/* Botões de filtro */}
                <div className="flex gap-2 mb-6">
                    {[3, 5, 12].map((months) => (
                        <button
                            key={months}
                            onClick={() => setSelectedMonths(months as 3 | 5 | 12)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                                selectedMonths === months
                                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                            }`}
                        >
                            {months}M
                        </button>
                    ))}
                </div>

                {/* Métricas rápidas */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wider">
                            Total
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrencyPTBR(totalRevenue)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wider">
                            Média
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrencyPTBR(averageRevenue)}
                        </p>
                    </div>
                </div>

                {/* Gráfico de Barras */}
                <div className="relative">
                    <div
                        className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-1 md:gap-2"
                        style={{ height: `${chartHeight}px` }}
                    >
                        {/* Eixo Y - Labels */}
                        <div
                            className="mb-6 hidden flex-col justify-between text-xs text-gray-600 dark:text-gray-500 sm:flex col-span-1"
                            style={{ height: `${chartHeight - 24}px` }}
                        >
                            {yAxisLabels.map((label) => (
                                <p key={label} className="text-right">
                                    {label}
                                </p>
                            ))}
                        </div>

                        {/* Barras */}
                        {revenue.map((month, index) => {
                            const barHeight =
                                (chartHeight / topLabel) * month.revenue;
                            const isLastMonth = index === revenue.length - 1;

                            return (
                                <div
                                    key={month.month}
                                    className="flex flex-col items-center gap-2 relative group"
                                >
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        {formatCurrencyPTBR(month.revenue)}
                                    </div>

                                    {/* Barra */}
                                    <div
                                        className={`
                                            w-full rounded-t-md transition-all duration-300 cursor-pointer
                                            ${
                                                isLastMonth
                                                    ? "bg-gradient-to-t from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20"
                                                    : "bg-gradient-to-t from-gray-400 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:from-gray-500 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500"
                                            }
                                        `}
                                        style={{ height: `${barHeight}px` }}
                                    />

                                    {/* Label do mês */}
                                    <p className="text-xs text-gray-600 dark:text-gray-500 -rotate-45 sm:rotate-0 mt-1">
                                        {month.month}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Linha de base */}
                    <div className="absolute bottom-6 left-8 right-0 h-px bg-gray-200 dark:bg-gray-800"></div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-500">
                            Dados atualizados mensalmente
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-500">
                            Tendência positiva
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
