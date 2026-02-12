import { Webhook } from "svix";
import { headers } from "next/headers";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: Request) {
    console.log("[WEBHOOK] ====== WEBHOOK CHAMADO ======");

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("[WEBHOOK] ❌ CLERK_WEBHOOK_SECRET não encontrado!");
        return new Response("Webhook secret not found", { status: 500 });
    }

    console.log("[WEBHOOK] ✅ Secret encontrado");

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("[WEBHOOK] ❌ Headers Svix ausentes");
        return new Response("Error occured -- no Svix headers", {
            status: 400,
        });
    }

    console.log("[WEBHOOK] ✅ Headers Svix presentes");

    const body = await req.text();
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as any;
        console.log("[WEBHOOK] ✅ Assinatura verificada");
    } catch (err) {
        console.error("[WEBHOOK] ❌ Erro ao verificar assinatura:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    const eventType = evt.type;
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    console.log(`[WEBHOOK] Event Type: ${eventType}`);
    console.log(`[WEBHOOK] User ID: ${id}`);
    console.log(`[WEBHOOK] Email: ${email_addresses?.[0]?.email_address}`);
    console.log(`[WEBHOOK] Name: ${first_name} ${last_name}`);

    try {
        if (eventType === "user.created") {
            const email = email_addresses?.[0]?.email_address;
            const name =
                `${first_name || ""} ${last_name || ""}`.trim() || email;

            if (!email) {
                console.error("[WEBHOOK] ❌ Email não fornecido");
                return new Response("Email not found", { status: 400 });
            }

            console.log(`[WEBHOOK] 📧 Processando user.created para: ${email}`);

            // Verificar se usuário já existe
            const existingUsers = await sql`
                SELECT id, clerk_user_id, organization_id
                FROM users 
                WHERE email = ${email}
            `;

            if (existingUsers.length > 0) {
                console.log(`[WEBHOOK] ℹ️ Usuário já existe: ${email}`);
                const existingUser = existingUsers[0];

                if (!existingUser.clerk_user_id) {
                    console.log("[WEBHOOK] 🔄 Atualizando clerk_user_id...");
                    await sql`
                        UPDATE users 
                        SET clerk_user_id = ${id}, 
                            image_url = ${image_url || null}
                        WHERE email = ${email}
                    `;
                    console.log(`[WEBHOOK] ✅ Atualizado: ${email}`);
                } else {
                    console.log(
                        `[WEBHOOK] ⚠️ Usuário já tem clerk_user_id: ${existingUser.clerk_user_id}`,
                    );
                }
            } else {
                console.log(`[WEBHOOK] 🆕 Criando novo usuário para: ${email}`);

                // 1. Criar organização
                console.log("[WEBHOOK] 📁 Criando organização...");
                // Gerar slug único baseado no nome e timestamp
                const orgName = name + "'s Organization";
                const baseSlug = orgName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                const uniqueSlug = `${baseSlug}-${Date.now()}`;

                const orgResult = await sql`
                    INSERT INTO organizations (id, name, slug, owner_id, created_at, updated_at)
                    VALUES (
                        gen_random_uuid(),
                        ${orgName},
                        ${uniqueSlug},
                        ${id},
                        NOW(),
                        NOW()
                    )
                    RETURNING id
                `;

                const organizationId = orgResult[0].id;
                console.log(
                    `[WEBHOOK] ✅ Organização criada: ${organizationId}`,
                );

                // 2. Criar usuário como ADMIN
                console.log("[WEBHOOK] 👤 Criando usuário...");
                await sql`
                    INSERT INTO users (
                        id, 
                        name, 
                        email, 
                        clerk_user_id, 
                        role, 
                        organization_id, 
                        image_url, 
                        password
                    )
                    VALUES (
                        gen_random_uuid(),
                        ${name},
                        ${email},
                        ${id},
                        'admin',
                        ${organizationId},
                        ${image_url || null},
                        'clerk-auth'
                    )
                `;

                console.log(
                    `[WEBHOOK] ✅✅✅ Usuário criado: ${email} como admin`,
                );
            }

            return new Response("User synced", { status: 200 });
        }

        if (eventType === "user.updated") {
            const email = email_addresses?.[0]?.email_address;
            const name =
                `${first_name || ""} ${last_name || ""}`.trim() || email;

            if (!email) {
                return new Response("Email not found", { status: 400 });
            }

            await sql`
                UPDATE users 
                SET name = ${name},
                    image_url = ${image_url || null}
                WHERE clerk_user_id = ${id}
            `;

            console.log(`[WEBHOOK] ✅ Usuário atualizado: ${email}`);
            return new Response("User updated", { status: 200 });
        }

        if (eventType === "user.deleted") {
            await sql`
                DELETE FROM users 
                WHERE clerk_user_id = ${id}
            `;

            console.log(`[WEBHOOK] ✅ Usuário deletado: ${id}`);
            return new Response("User deleted", { status: 200 });
        }

        console.log("[WEBHOOK] ⚠️ Evento não tratado:", eventType);
        return new Response("Event type not handled", { status: 200 });
    } catch (error) {
        console.error("[WEBHOOK] ❌❌❌ ERRO:", error);
        console.error(
            "[WEBHOOK] Stack:",
            error instanceof Error ? error.stack : "N/A",
        );
        return new Response(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            {
                status: 500,
            },
        );
    }
}
