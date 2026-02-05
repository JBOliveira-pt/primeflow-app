import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
    try {
        // Check customers table
        const customers = await sql`
      SELECT id, name, 
             CASE WHEN photo IS NOT NULL THEN 'HAS_PHOTO' ELSE 'NO_PHOTO' END as photo_status,
             image_url
      FROM customers 
      LIMIT 5
    `;

        // Check users table
        const users = await sql`
      SELECT id, name, 
             CASE WHEN photo IS NOT NULL THEN 'HAS_PHOTO' ELSE 'NO_PHOTO' END as photo_status,
             image_url
      FROM users 
      LIMIT 5
    `;

        return NextResponse.json({
            customers,
            users,
            message:
                "Check if image_url column exists and if photos need migration",
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
