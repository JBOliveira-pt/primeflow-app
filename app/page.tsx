import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import styles from "@/app/ui/home.module.css";
import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col p-6 bg-white dark:bg-slate-950">
            <div
                className="flex h-30 shrink-0 items-end rounded-lg bg-[#141828] p-4 text-white dark:bg-slate-800 md:h-32"
                style={{
                    fontSize: "45px",
                    fontFamily: "Atyp-Semibold, sans-serif",
                }}
            >
                <AcmeLogo />
                <strong>PrimeFlow</strong>
            </div>
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 dark:bg-slate-900 px-6 py-10 md:w-2/5 md:px-20">
                    <p
                        className={`${lusitana.className} text-xl text-gray-800 dark:text-gray-100 md:text-3xl md:leading-normal`}
                    >
                        Welcome to <strong>PrimeFlow</strong>.
                        <br />
                        The future of financial clarity starts here.
                    </p>
                    <Link
                        href="/login"
                        className="flex items-center gap-5 self-start rounded-lg bg-[#141828] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white md:text-base"
                    >
                        <span>Log in</span>{" "}
                        <ArrowRightIcon className="w-5 md:w-6" />
                    </Link>
                </div>
                <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                    {/* Add Hero Images Here */}
                    <Image
                        src="/primeflow-hero-desktop.png"
                        width={1000}
                        height={760}
                        className="hidden md:block"
                        alt="Screenshots of the dashboard project showing desktop version"
                    />
                    <Image
                        src="/primeflow-hero-mobile.png"
                        width={560}
                        height={620}
                        className="md:hidden"
                        alt="Screenshots of the dashboard project showing mobile version"
                    />
                </div>
            </div>
        </main>
    );
}
