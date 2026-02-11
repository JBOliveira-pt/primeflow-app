# Configuração do Webhook Clerk

## Problema Atual

Os usuários são criados no Clerk mas não sincronizam automaticamente com o banco Neon porque o webhook não está configurado.

## Solução Imediata (Atual)

Acesse enquanto estiver logado:

```
http://localhost:3000/sync
```

Isso vinculará manualmente seu Clerk User ID ao registro do banco.

---

## Configuração Permanente do Webhook

### 1. Acesse o Clerk Dashboard

https://dashboard.clerk.com/

### 2. Vá para Webhooks

- No menu lateral: **Configure** → **Webhooks**
- Clique em **Add Endpoint**

### 3. Configure o Endpoint

**Para desenvolvimento local (use um serviço de túnel):**

```
URL: https://seu-app.ngrok.io/api/webhooks/clerk
```

**Para produção:**

```
URL: https://seu-dominio.com/api/webhooks/clerk
```

### 4. Selecione Eventos

Marque os seguintes eventos:

- ✅ `user.created`
- ✅ `user.updated`
- ✅ `user.deleted`

### 5. Copie o Signing Secret

Após criar o endpoint, copie o **Signing Secret** exibido.

### 6. Adicione ao .env.local

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
```

### 7. Reinicie o servidor

```bash
npm run dev
```

---

## Testando o Webhook

### Opção 1: Via Clerk Dashboard

- Vá para a página do webhook
- Clique em **Testing** → **Send Example**
- Escolha `user.created` e envie

### Opção 2: Criar novo usuário

- Faça signup com um novo email
- Verifique os logs do servidor
- Confirme no banco se o `clerk_user_id` foi preenchido

---

## Desenvolvimento Local com Ngrok

Se estiver desenvolvendo localmente, use ngrok para expor o webhook:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3000
ngrok http 3000
```

Use a URL gerada (ex: `https://abc123.ngrok.io`) no Clerk Dashboard.

---

## Verificando se Funcionou

Execute no Neon SQL Editor:

```sql
SELECT email, clerk_user_id, role, organization_id
FROM users;
```

Todos os usuários devem ter `clerk_user_id` preenchido após o webhook estar ativo.

---

## Sincronizando Usuários Existentes

Se você já tem usuários no Clerk mas sem `clerk_user_id` no banco:

1. Cada usuário deve acessar: `http://localhost:3000/sync`
2. Ou execute manualmente no SQL (se souber o Clerk User ID):

```sql
UPDATE users
SET clerk_user_id = 'user_xxxxxxxxxxxxx',
    organization_id = '00000000-0000-0000-0000-000000000000'
WHERE email = 'usuario@example.com';
```

---

## Troubleshooting

### Webhook não está recebendo eventos

- Verifique se a URL está acessível publicamente
- Confirme que o `CLERK_WEBHOOK_SECRET` está correto no `.env.local`
- Veja os logs do webhook no Clerk Dashboard → Webhooks → Logs

### Erro 400 "Error occurred -- no Svix headers"

- O endpoint está sendo acessado diretamente sem passar pelo Clerk
- Apenas o Clerk deve chamar esse endpoint

### Erro 500 "Webhook secret not found"

- Falta o `CLERK_WEBHOOK_SECRET` no `.env.local`
- Reinicie o servidor após adicionar

---

## Lógica do Webhook

Quando um usuário faz signup:

1. Clerk dispara evento `user.created`
2. Webhook recebe e valida assinatura
3. Verifica se é o primeiro admin da organização
4. Insere/atualiza usuário no Neon com:
    - `clerk_user_id` do Clerk
    - `organization_id` padrão
    - `role` = 'admin' (primeiro) ou 'user' (demais)
