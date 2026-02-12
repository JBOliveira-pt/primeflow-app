import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * Script para gerar links de convite para usuários existentes
 * Execute: npx tsx scripts/invite-existing-users.ts
 */
async function inviteExistingUsers() {
    console.log("🚀 Gerando convites para usuários existentes...\n");

    try {
        // Buscar usuários sem clerk_user_id
        const users = await sql`
      SELECT id, name, email, role
      FROM users
      WHERE clerk_user_id IS NULL
      ORDER BY role DESC, name ASC
    `;

        if (users.length === 0) {
            console.log("✅ Todos os usuários já estão sincronizados!");
            return;
        }

        console.log(
            `📋 Encontrados ${users.length} usuários para sincronizar:\n`,
        );

        for (const user of users) {
            const roleEmoji = user.role === "admin" ? "👑" : "👤";
            console.log(
                `${roleEmoji} ${user.name} (${user.email}) - ${user.role}`,
            );
        }

        console.log("\n📧 Instruções para cada usuário:\n");
        console.log("1. Acesse: https://seu-dominio.com/signup");
        console.log("2. Cadastre-se com o EMAIL listado acima");
        console.log("3. Use QUALQUER SENHA (não precisa ser a antiga)");
        console.log("4. O sistema vinculará automaticamente sua conta\n");

        console.log(
            "💡 Dica: Use login social (GitHub/Google) para mais rapidez!\n",
        );

        // Alternativa: criar convites do Clerk
        console.log(
            "🔗 Ou use a API do Clerk para criar convites automáticos:",
        );
        console.log("   https://clerk.com/docs/organizations/invitations\n");
    } catch (error) {
        console.error("❌ Erro:", error);
    } finally {
        await sql.end();
    }
}

inviteExistingUsers();
