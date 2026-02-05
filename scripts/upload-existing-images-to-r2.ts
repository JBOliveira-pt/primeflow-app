import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

async function migrateExistingImages() {
    console.log("🚀 Starting image migration to R2...");

    // Migrate customer photos
    const customers =
        await sql`SELECT id, photo FROM customers WHERE photo IS NOT NULL`;

    for (const customer of customers) {
        const key = `customer/${customer.id}.png`;

        await r2Client.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: key,
                Body: customer.photo,
                ContentType: "image/png",
            }),
        );

        const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

        await sql`
      UPDATE customers 
      SET image_url = ${imageUrl}
      WHERE id = ${customer.id}
    `;

        console.log(`✅ Migrated customer ${customer.id}`);
    }

    // Migrate user photos
    const users =
        await sql`SELECT id, photo FROM users WHERE photo IS NOT NULL`;

    for (const user of users) {
        const key = `user/${user.id}.png`;

        await r2Client.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: key,
                Body: user.photo,
                ContentType: "image/png",
            }),
        );

        const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

        await sql`
      UPDATE users 
      SET image_url = ${imageUrl}
      WHERE id = ${user.id}
    `;

        console.log(`✅ Migrated user ${user.id}`);
    }

    console.log("🎉 Migration completed!");
    process.exit(0);
}

migrateExistingImages().catch(console.error);
