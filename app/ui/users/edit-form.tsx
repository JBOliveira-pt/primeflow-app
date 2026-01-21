"use client";

import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useActionState, useState, ChangeEvent } from "react";
import { updateUser, UserState } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";
import {
    AtSymbolIcon,
    PhotoIcon,
    UserIcon,
    KeyIcon,
} from "@heroicons/react/24/outline";

const initialState: UserState = { message: null, errors: {} };

function splitName(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts.shift() || "";
    const lastName = parts.join(" ");
    return { firstName, lastName };
}

export default function EditUserForm({ user }: { user: User }) {
    const { firstName, lastName } = splitName(user.name);
    const updateUserWithId = updateUser.bind(null, user.id);
    const [state, formAction] = useActionState(updateUserWithId, initialState);
    const [preview, setPreview] = useState<string | null>(null);

    function onFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        } else {
            setPreview(null);
        }
    }

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-medium"
                        >
                            First name
                        </label>
                        <div className="relative">
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                defaultValue={firstName}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="firstName-error"
                            />
                            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                        <div
                            id="firstName-error"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {state.errors?.firstName?.map((error) => (
                                <p key={error} className="text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium"
                        >
                            Last name
                        </label>
                        <div className="relative">
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                defaultValue={lastName}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="lastName-error"
                            />
                            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                        <div
                            id="lastName-error"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {state.errors?.lastName?.map((error) => (
                                <p key={error} className="text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user.email}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="email-error"
                        />
                        <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email?.map((error) => (
                            <p key={error} className="text-sm text-red-500">
                                {error}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium"
                    >
                        Password (leave blank to keep current)
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            placeholder="Enter new password"
                            aria-describedby="password-error"
                        />
                        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div
                        id="password-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.password?.map((error) => (
                            <p key={error} className="text-sm text-red-500">
                                {error}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <label
                        htmlFor="imageFile"
                        className="block text-sm font-medium"
                    >
                        Photo
                    </label>
                    <div className="flex items-center gap-4">
                        <img
                            src={preview ?? `/api/image/user/${user.id}`}
                            alt="User avatar preview"
                            className="h-16 w-16 rounded-full object-cover border border-gray-200"
                        />
                        <div className="text-xs text-gray-500">
                            {preview ? "Preview da nova foto" : "Foto atual"}
                        </div>
                    </div>
                    <input
                        id="imageFile"
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-300"
                    />
                    <p className="text-xs text-gray-500">
                        Upload a new photo (optional).
                    </p>
                </div>

                <div className="mt-4 space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium">
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2"
                        defaultValue={user.role || "user"}
                        aria-describedby="role-error"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div id="role-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.role?.map((error) => (
                            <p key={error} className="text-sm text-red-500">
                                {error}
                            </p>
                        ))}
                    </div>
                </div>

                {state.message ? (
                    <p className="mt-4 text-sm text-red-500">{state.message}</p>
                ) : null}
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/users"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Update User</Button>
            </div>
        </form>
    );
}
