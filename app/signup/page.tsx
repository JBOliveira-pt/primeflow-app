"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrganizationAndAdmin } from "@/app/lib/actions";

type FormState = {
    message: string | null;
    errors?: Record<string, string[]>;
    success?: boolean;
};

export default function SignUpPage() {
    const [state, setState] = useState<FormState>({
        message: null,
        errors: {},
    });
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await createOrganizationAndAdmin(formData);

            if (result?.success) {
                router.push("/login");
            } else {
                setState({
                    message: result?.message || "An error occurred",
                    errors: result?.errors,
                    success: false,
                });
            }
        });
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">
                        Create Your Organization
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Start managing your finances today
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Organization Name */}
                        <div>
                            <label
                                htmlFor="orgName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Organization Name
                            </label>
                            <input
                                id="orgName"
                                name="orgName"
                                type="text"
                                placeholder="Acme Corp"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                                disabled={isPending}
                            />
                            {state.errors?.orgName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {state.errors.orgName[0]}
                                </p>
                            )}
                        </div>

                        {/* Admin Name */}
                        <div>
                            <label
                                htmlFor="adminName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Your Name
                            </label>
                            <input
                                id="adminName"
                                name="adminName"
                                type="text"
                                placeholder="John Doe"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                                disabled={isPending}
                            />
                            {state.errors?.adminName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {state.errors.adminName[0]}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@acme.com"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                                disabled={isPending}
                            />
                            {state.errors?.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {state.errors.email[0]}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                                disabled={isPending}
                                minLength={6}
                            />
                            {state.errors?.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {state.errors.password[0]}
                                </p>
                            )}
                        </div>

                        {/* Error Message */}
                        {state.message && !state.success && (
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-800">
                                    {state.message}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isPending ? "Creating..." : "Create Organization"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
