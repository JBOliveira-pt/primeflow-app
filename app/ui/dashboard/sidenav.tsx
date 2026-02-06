"use client";

import {
  LogOut,
  User,
  Users,
  History,
  Home,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import AcmeLogo from "@/app/ui/acme-logo";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão Mobile - Visível apenas em telas pequenas */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-950 text-white rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - Visível apenas no mobile quando o menu está aberto */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 lg:w-70 
          bg-gray-950 text-white 
          flex flex-col 
          border-r border-gray-800 
          h-full
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 mt-16 lg:mt-8 px-6">
          <div className="w-10 h-10 flex items-center justify-center">
            <AcmeLogo />
          </div>
          <div className="text-xl font-bold">
            <p>PrimeFLOW</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-full gap-2 px-3">
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
            icon={<History size={20} />}
            label="Customers"
            onClick={() => setIsOpen(false)}
          />

          <NavItem
            href="/dashboard/users"
            icon={<Users size={20} />}
            label="Users"
            onClick={() => setIsOpen(false)}
          />
        </nav>

        {/* Sign Out Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            signOut({ callbackUrl: "/login" });
          }}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full p-3 mx-3 rounded-xl hover:bg-red-500/10 mt-auto mb-4"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
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