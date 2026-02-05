import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function migrateToR2() {
    console.log("Starting migration...");

    // Add new image_url column to customers table
    await sql`
    ALTER TABLE customers 
    ADD COLUMN IF NOT EXISTS image_url TEXT;
  `;

    // Add new image_url column to users table
    await sql`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS image_url TEXT;
  `;

    console.log("✅ Added image_url columns");

    // Optional: Remove photo BYTEA column later after migration
    // await sql`ALTER TABLE customers DROP COLUMN IF EXISTS photo;`;
    // await sql`ALTER TABLE users DROP COLUMN IF EXISTS photo;`;

    console.log("✅ Migration completed!");
    process.exit(0);
}

migrateToR2().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});
