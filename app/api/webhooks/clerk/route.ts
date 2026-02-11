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

    console.log(`Webhook Event Type: ${eventType}`);
    console.log(`Webhook Event Data:`, evt.data);

    try {
        if (eventType === "user.created") {
            // New user signed up
            const email = email_addresses[0]?.email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            if (!email) {
                return new Response("No email provided", { status: 400 });
            }

            // Check if user already exists
            const existingUser = await sql`
        SELECT id FROM users WHERE email = ${email}
      `;

            if (existingUser.length > 0) {
                // User exists, update clerk_id
                await sql`
          UPDATE users 
          SET clerk_user_id = ${id}
          WHERE email = ${email}
        `;
                console.log(`Updated existing user with Clerk ID: ${id}`);
            } else {
                // Check if this is the first user (will be admin)
                const existingUsers = await sql`
          SELECT id FROM users WHERE role = 'admin' LIMIT 1
        `;

                const isFirstUser = existingUsers.length === 0;
                const role = isFirstUser ? "admin" : "user";
                let organizationId: string;

                if (isFirstUser) {
                    // Create new organization for first admin
                    const orgName = name
                        ? `${name}'s Organization`
                        : "My Organization";
                    const orgSlug = orgName
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-");

                    const newOrg = await sql`
            INSERT INTO organizations (id, name, slug, owner_id, created_at, updated_at)
            VALUES (
              gen_random_uuid(),
              ${orgName},
              ${orgSlug},
              ${id},
              NOW(),
              NOW()
            )
            RETURNING id
          `;
                    organizationId = newOrg[0].id;
                    console.log(`Created new organization: ${orgName}`);
                } else {
                    // Get the first organization (assuming single-org for now)
                    const org = await sql`
            SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1
          `;

                    if (org.length === 0) {
                        return new Response("No organization found", {
                            status: 500,
                        });
                    }

                    organizationId = org[0].id;
                }

                // Create new user
                await sql`
          INSERT INTO users (id, name, email, clerk_user_id, role, organization_id, image_url, password)
          VALUES (
            gen_random_uuid(),
            ${name},
            ${email},
            ${id},
            ${role},
            ${organizationId},
            ${image_url || null},
            'clerk-auth'
          )
        `;

                console.log(`Created new user with role: ${role}`);
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
