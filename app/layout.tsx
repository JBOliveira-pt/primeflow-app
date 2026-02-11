import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
    title: "PrimeFlow Dashboard",
    description: "PrimeFlow finance operations dashboard.",
    metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
    icons: {
        icon: "/favicon-black.ico",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" className="h-full">
                <body
                    className={`${inter.className} h-full bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}
                >
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
