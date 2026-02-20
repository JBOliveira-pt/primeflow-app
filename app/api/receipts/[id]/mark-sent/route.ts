import { auth } from "@clerk/nextjs/server";
import postgres from "postgres";
import { NextResponse } from "next/server";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;

        // Get current user ID from database
        const user = await sql`
            SELECT id FROM users WHERE clerk_user_id = ${userId}
        `;

        if (user.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const currentUserId = user[0].id;

        // Update receipt status and sent_at timestamp
        await sql`
            UPDATE receipts
            SET 
                status = 'sent_to_customer',
                sent_at = NOW(),
                sent_by_user = ${currentUserId}
            WHERE id = ${id}
        `;

        return NextResponse.json(
            { message: "Receipt marked as sent" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error marking receipt as sent:", error);
        return NextResponse.json(
            { error: "Failed to mark receipt as sent" },
            { status: 500 },
        );
    }
}
