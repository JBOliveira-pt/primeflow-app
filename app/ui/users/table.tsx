import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { User } from "@/app/lib/definitions";
import { UpdateUser, DeleteUser } from "@/app/ui/users/buttons";
import { auth } from "@/auth";

export default async function UsersTable({ users }: { users: User[] }) {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "admin";

    return (
        <div className="w-full">
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                            <div className="md:hidden">
                                {users?.map((user) => (
                                    <div
                                        key={user.id}
                                        className="mb-2 w-full rounded-md bg-white p-4"
                                    >
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <div className="mb-2 flex items-center gap-3">
                                                    <Image
                                                        src={user.image_url}
                                                        alt={`${user.name}'s profile picture`}
                                                        width={28}
                                                        height={28}
                                                        className="rounded-full object-cover"
                                                    />
                                                    <p className="font-medium">
                                                        {user.name}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Role: {user.role || "user"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            {isAdmin ? (
                                                <div className="flex gap-3">
                                                    <UpdateUser id={user.id} />
                                                    <DeleteUser id={user.id} />
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-5 font-medium sm:pl-6"
                                        >
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-5 font-medium"
                                        >
                                            Email
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-5 font-medium"
                                        >
                                            Role
                                        </th>
                                        {isAdmin ? (
                                            <th
                                                scope="col"
                                                className="relative py-3 pl-6 pr-3"
                                            >
                                                <span className="sr-only">
                                                    Edit
                                                </span>
                                            </th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-gray-900">
                                    {users.map((user) => (
                                        <tr key={user.id} className="group">
                                            <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={user.image_url}
                                                        alt={`${user.name}'s profile picture`}
                                                        width={28}
                                                        height={28}
                                                        className="rounded-full object-cover"
                                                    />
                                                    <p>{user.name}</p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {user.email}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                                        user.role === "admin"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {user.role || "user"}
                                                </span>
                                            </td>
                                            {isAdmin ? (
                                                <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                                                    <div className="flex justify-end gap-3">
                                                        <UpdateUser
                                                            id={user.id}
                                                        />
                                                        <DeleteUser
                                                            id={user.id}
                                                        />
                                                    </div>
                                                </td>
                                            ) : null}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
