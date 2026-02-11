import { Webhook } from "svix";
import { headers } from "next/headers";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return new Response("Webhook secret not found", { status: 500 });
    }

    // Get headers from request
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If no headers, return error
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no Svix headers", {
            status: 400,
        });
    }

    // Get body
    const body = await req.text();

    // Create a new Webhook instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the webhook
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as any;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    // Extract the data
    const eventType = evt.type;
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    console.log(`[WEBHOOK] Event Type: ${eventType}`);
    console.log(`[WEBHOOK] User ID: ${id}`);
    console.log(`[WEBHOOK] Email: ${email_addresses?.[0]?.email_address}`);
    console.log(`[WEBHOOK] Name: ${first_name} ${last_name}`);

    try {
        if (eventType === "user.created") {
            // New user signed up - just create user record with NULL organization_id
            // Organization will be created in /api/onboarding page
            const email = email_addresses[0]?.email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

            if (!email) {
                console.error("[WEBHOOK] No email provided");
                return new Response("No email provided", { status: 400 });
            }

            console.log(`[WEBHOOK] Processing user.created for: ${email}`);

            // Check if user already exists (created by admin via dashboard)
            const existingUser = await sql`
        SELECT id, organization_id, clerk_user_id FROM users WHERE email = ${email}
      `;

            if (existingUser.length > 0) {
                console.log(`[WEBHOOK] User exists in DB: ${email}`);
                // User was created by admin via dashboard, just update clerk_id
                await sql`
          UPDATE users 
          SET clerk_user_id = ${id}, image_url = ${image_url || null}
          WHERE email = ${email}
        `;
                console.log(`[WEBHOOK] ✅ Updated existing user with Clerk ID: ${id}`);
            } else {
                console.log(`[WEBHOOK] Creating new user for: ${email}`);
                // New signup via Clerk - create user with NULL organization_id
                // User will complete organization setup in /onboarding
                await sql`
          INSERT INTO users (id, name, email, clerk_user_id, role, organization_id, image_url, password)
          VALUES (
            gen_random_uuid(),
            ${name},
            ${email},
            ${id},
            'user',
            NULL,
            ${image_url || null},
            'clerk-auth'
          )
        `;

                console.log(
                    `[WEBHOOK] ✅ Created user: ${email} → redirects to /onboarding to create organization`,
                );
            }

            return new Response("User synced", { status: 200 });
        }

        if (eventType === "user.updated") {
            // User updated in Clerk
            const email = email_addresses[0]?.email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            if (!email) {
                return new Response("No email provided", { status: 400 });
            }

            // Update user in database
            await sql`
        UPDATE users 
        SET 
          name = ${name},
          image_url = ${image_url || null},
          clerk_user_id = ${id}
        WHERE email = ${email}
      `;

            console.log(`Updated user: ${email}`);
            return new Response("User updated", { status: 200 });
        }

        if (eventType === "user.deleted") {
            // User deleted from Clerk
            // Optionally: soft delete or hard delete the user
            await sql`
        DELETE FROM users WHERE clerk_user_id = ${id}
      `;

            console.log(`Deleted user with Clerk ID: ${id}`);
            return new Response("User deleted", { status: 200 });
        }

        return new Response("Event type not handled", { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            {
                status: 500,
            },
        );
    }
}
