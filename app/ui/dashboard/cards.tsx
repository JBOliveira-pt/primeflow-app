// app/ui/dashboard/cards.tsx
import { fetchCardData } from "@/app/lib/data";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/card";

// Função para formatar valores monetários
function formatCurrency(value: string | number): string {
  // Se for string com $, remove e converte
  if (typeof value === 'string') {
    const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(numValue || 0);
  }
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(value);
}

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      {/* Card 1 - Receitas Coletadas */}
      <Card className="text-white hover:border-green-800/50 transition-all duration-200 col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xs">COLETADO</CardTitle>
          
          <div className="p-1.5 bg-green-500/10 rounded-lg">
            <DollarSign className="text-green-500 w-4 h-4" />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">
            {formatCurrency(totalPaidInvoices)}
          </div>

          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="text-green-500 w-3 h-3" />
            <span className="text-xs text-green-500">+12.5%</span>
          </div>
        </CardContent>

      </Card>

      {/* Card 2 - Valores Pendentes */}
      <Card className="text-white hover:border-yellow-800/50 transition-all duration-200 col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xs">PENDENTE</CardTitle>
          <div className="p-1.5 bg-yellow-500/10 rounded-lg">
            <Clock className="text-yellow-500 w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">
            {formatCurrency(totalPendingInvoices)}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-yellow-500">5 faturas</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3 - Total de Faturas */}
      <Card className="text-white hover:border-blue-800/50 transition-all duration-200 col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xs">FATURAS</CardTitle>
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <FileText className="text-blue-500 w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">{numberOfInvoices}</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 4 - Total de Clientes */}
      <Card className="text-white bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-800/50 col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xs text-purple-200">CLIENTES</CardTitle>
          <div className="p-1.5 bg-purple-500/10 rounded-lg">
            <Users className="text-purple-400 w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-purple-100">
            {numberOfCustomers}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="text-purple-400 w-3 h-3" />
            <span className="text-xs text-purple-400">+8%</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}