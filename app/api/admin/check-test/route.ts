import postgres from "postgres";
import { NextRequest, NextResponse } from "next/server";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT id, name, email, image_url FROM customers 
      WHERE name IN ('Hector Simpson', 'Steven Tey', 'Emil L') 
      ORDER BY name
    `;
    
    return NextResponse.json({
      message: "Test customers found",
      customers: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error), message: "Query failed" },
      { status: 500 }
    );
  }
}
