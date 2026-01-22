"use client";

import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: DocumentDuplicateIcon,
    },
    { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
    { name: "Users", href: "/dashboard/users", icon: UsersIcon },
];

export default function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#141828] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141828] dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-slate-200 text-[#141828] dark:bg-slate-800 dark:text-white":
                                    pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
