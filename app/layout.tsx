import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "PrimeFlow Dashboard",
    description: "PrimeFlow finance operations dashboard.",
    metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
            <body
                className={`${inter.className} h-full bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}
            >
                {children}
            </body>
        </html>
    );
}
