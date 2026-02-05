"use client";

import LoginView from "../ui/login-form";
import RegisterView from "../ui/submit-form";
import { useState } from "react";

export default function LoginPage() {
    const [currentView, setCurrentView] = useState<"login" | "register">(
        "login",
    );

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
            {currentView === "login" && <LoginView setView={setCurrentView} />}
            {currentView === "register" && (
                <RegisterView setView={setCurrentView} />
            )}
        </main>
    );
}
