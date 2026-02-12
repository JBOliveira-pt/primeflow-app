import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/app/components/theme-provider";

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
                <head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function() {
                                    const theme = localStorage.getItem('theme') || 'light';
                                    if (theme === 'dark') {
                                        document.documentElement.classList.add('dark');
                                    } else {
                                        document.documentElement.classList.remove('dark');
                                    }
                                })();
                            `,
                        }}
                    />
                </head>
                <body
                    className={`${inter.className} h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}
                >
                    <ThemeProvider>{children}</ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
