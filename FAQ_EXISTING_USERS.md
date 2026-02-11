# ❓ FAQ - Usuários Existentes no Neon + Clerk

## 1. Preciso usar a mesma senha do Neon no Clerk?

**NÃO!** A senha antiga não funciona mais.

### Como funcionava antes (NextAuth):

```
Login → Verifica senha no Neon → Acesso permitido
```

### Como funciona agora (Clerk):

```
Login → Clerk verifica senha → Clerk retorna token → Sistema valida token
```

**A senha no Neon não é mais usada!** ❌

---

## 2. Como vincular meus 3 usuários atuais?

### Opção A: Signup Manual (Recomendado) ✅

Cada usuário deve:

1. **Acessar**: `https://seu-dominio.com/signup`
2. **Email**: Usar o **mesmo email** do Neon
    - ✅ `contacto.primeflow@gmail.com`
    - ✅ `everton@primeflow.com`
    - ✅ `bernardo@primeflow.com`
3. **Senha**: Criar uma **nova senha** (pode ser diferente)
4. **Pronto!** O webhook vincula automaticamente

### Opção B: Login Social (Mais Rápido) 🚀

1. Clicar em **"Continuar com GitHub"** ou **"Google"**
2. Se o email do GitHub/Google for o mesmo do Neon → vinculado!

### Opção C: Script Automático

Execute o script:

```bash
npx tsx scripts/invite-existing-users.ts
```

Isso lista todos os usuários pendentes de sincronização.

---

## 3. O que acontece quando faço signup?

### Exemplo: `contacto.primeflow@gmail.com`

#### Antes do Signup:

```sql
-- Tabela users no Neon
id: 9a8cc227-...
email: contacto.primeflow@gmail.com
clerk_user_id: NULL  ❌ (não vinculado)
role: admin
```

#### Durante o Signup:

1. **Clerk cria conta** → `user_xyz123abc`
2. **Webhook dispara** com dados:
    ```json
    {
        "type": "user.created",
        "data": {
            "id": "user_xyz123abc",
            "email_addresses": [
                {
                    "email_address": "contacto.primeflow@gmail.com"
                }
            ]
        }
    }
    ```
3. **Webhook verifica**:
    ```sql
    SELECT * FROM users
    WHERE email = 'contacto.primeflow@gmail.com';
    ```
4. **Encontrou!** → Atualiza:
    ```sql
    UPDATE users
    SET clerk_user_id = 'user_xyz123abc'
    WHERE email = 'contacto.primeflow@gmail.com';
    ```

```sql
-- Tabela users no Neon
id: 9a8cc227-...
email: contacto.primeflow@gmail.com
clerk_user_id: user_xyz123abc  ✅ (vinculado!)
role: admin
```

---

## 4. Meu role (admin/user) é mantido?

**SIM!** ✅ O webhook **não altera** o role de usuários existentes.

```typescript
// Trecho do webhook
if (existingUser.length > 0) {
    // Usuário já existe → apenas vincula clerk_id
    await sql`
    UPDATE users 
    SET clerk_user_id = ${id}
    WHERE email = ${email}
  `;
    // ⚠️ NÃO altera o role!
}
```

Apenas **novos usuários** seguem a regra:

- Primeiro da org → admin
- Demais → user

---

## 5. E se eu criar um usuário com email diferente?

### Exemplo: novo usuário `maria@primeflow.com`

1. **Webhook verifica**: email existe no Neon?
2. **Não existe!** → Cria novo registro:
    ```sql
    INSERT INTO users (name, email, clerk_user_id, role, organization_id)
    VALUES ('Maria Silva', 'maria@primeflow.com', 'user_abc456', 'user', '00000000-...');
    ```
3. Role será **user** (já existe admin na org)

---

## 6. Posso apagar a coluna `password` do Neon?

**Não recomendado!** ⚠️

Mantenha por enquanto para:

- Backup/auditoria
- Possível rollback
- Migração gradual

Mas ela **não é mais usada** para login.

---

## 7. Como testar se funcionou?

### Teste 1: Verificar vinculação

```sql
SELECT
  name,
  email,
  role,
  clerk_user_id,
  CASE
    WHEN clerk_user_id IS NULL THEN '❌ Não vinculado'
    ELSE '✅ Vinculado'
  END as status
FROM users
ORDER BY role DESC;
```

### Teste 2: Fazer login

1. Acesse `/login`
2. Clique em "Entrar"
3. Use email + nova senha do Clerk
4. ✅ Deve logar normalmente

### Teste 3: Verificar permissões

Como **admin**:

- ✅ Vê botões "Adicionar", "Editar", "Deletar"

Como **user**:

- ❌ Não vê botões de ação

---

## 8. Resumo Rápido

| Questão                        | Resposta                |
| ------------------------------ | ----------------------- |
| Usar mesma senha?              | ❌ Não, crie uma nova   |
| Manter mesmo email?            | ✅ Sim, obrigatório     |
| Role é mantido?                | ✅ Sim, para existentes |
| Login social funciona?         | ✅ Sim (GitHub/Google)  |
| Senha do Neon usada?           | ❌ Não, nunca mais      |
| Posso deletar usuários velhos? | ⚠️ Não, apenas vincule  |

---

## 🎯 Checklist para cada usuário

- [ ] Acesse `/signup`
- [ ] Use o **mesmo email** do Neon
- [ ] Crie uma **nova senha** (qualquer uma)
- [ ] Complete o signup
- [ ] Faça login para testar
- [ ] Verifique se seu role está correto

**Pronto!** 🎉
