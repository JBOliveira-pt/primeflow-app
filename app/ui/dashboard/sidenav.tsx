// app/ui/dashboard/sidenav.tsx
"use client";

import {
  LogOut,
  User,
  Users,
  History,
  Home,
  Menu,
  X,
  Plus,
} from "lucide-react";
import Link from "next/link";
import AcmeLogo from "@/app/ui/acme-logo";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/app/components/Header";
import { Button } from "@/app/components/button";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Botão do menu mobile para passar ao header
  const mobileMenuTrigger = (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="p-2 bg-gray-900 text-white rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
      aria-label="Toggle menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // Dados do usuário (você pode pegar da sessão)
  const userData = {
    nome: "João Silva",
    role: "Admin",
    foto: undefined, // ou URL da foto
  };

  return (
    <>
      {/* Overlay - Visível apenas no mobile quando o menu está aberto */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Header */}
      <DashboardHeader 
        mobileMenuTrigger={mobileMenuTrigger}
       
        user={userData}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          w-64 bg-gray-950 text-white p-6 flex flex-col border-r border-gray-800 h-screen
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-15 h-10 flex items-center justify-center">
            <AcmeLogo />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              PrimeFLOW
            </h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 space-y-2">
          <NavItem
            icon={<Home size={20} />}
            label="Home"
            href="/dashboard"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            href="/dashboard/invoices"
            icon={<User size={20} />}
            label="Invoices"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            href="/dashboard/customers"
            icon={<Users size={20} />}
            label="Customers"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            href="/dashboard/users"
            icon={<History size={20} />}
            label="Users"
            onClick={() => setIsOpen(false)}
          />
        </nav>

        {/* Sign Out Button */}
        <div className="pt-6 border-t border-gray-900">
          <button
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: "/login" });
            }}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full p-3 rounded-lg hover:bg-red-500/10 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sair da conta</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-blue-600/10 text-blue-400 border-r-2 border-blue-500"
          : "text-gray-400 hover:bg-gray-900 hover:text-gray-100"
      }`}
    >
      <span
        className={
          active
            ? "text-blue-400"
            : "text-gray-500 group-hover:text-white transition-colors"
        }
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}