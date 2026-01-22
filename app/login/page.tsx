import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center bg-white dark:bg-slate-950 md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-[#141828] p-3 text-white dark:bg-slate-800 md:h-36">
                    <div className="w-32 md:w-36">
                        <AcmeLogo />
                    </div>
                </div>
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}
