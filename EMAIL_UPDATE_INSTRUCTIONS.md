# 📧 Atualização de Email - Instruções

## ✅ Script SQL Criado

O arquivo SQL foi criado em:

```
migrations/update_admin_email.sql
```

---

## 🚀 Passos para Executar

### 1. Acesse seu Banco Neon

Vá para [Neon Dashboard](https://console.neon.tech) → Seu Projeto → SQL Editor

### 2. Execute o SQL

Copie e cole este comando:

```sql
-- Atualizar email do admin
UPDATE users
SET email = 'contacto.primeflow@gmail.com'
WHERE email = 'jeisonoliveira@primeflow.com';
```

### 3. Verifique a Alteração

```sql
-- Verificar se funcionou
SELECT id, name, email, role, clerk_user_id
FROM users
WHERE email = 'contacto.primeflow@gmail.com';
```

Resultado esperado:

```
id: 9a8cc227-f07b-491d-a95b-26ce41e48f4f
name: Jeison Oliveira
email: contacto.primeflow@gmail.com  ✅
role: admin
clerk_user_id: NULL
```

---

## 🔗 Próximo Passo: Vincular ao Clerk

Agora que o email foi atualizado no Neon, você precisa fazer signup no Clerk:

### Opção 1: Email + Senha

1. Acesse: `https://seu-dominio.com/signup`
2. Email: `contacto.primeflow@gmail.com`
3. Senha: Qualquer senha nova
4. ✅ O webhook vincula automaticamente!

### Opção 2: Login com Google (Mais Rápido!) ⚡

1. Acesse: `https://seu-dominio.com/signup`
2. Clique em **"Continuar com Google"**
3. Use a conta **contacto.primeflow@gmail.com**
4. ✅ Vinculado instantaneamente!

---

## 📊 Status Atual

### Antes da Migração

```
Email: jeisonoliveira@primeflow.com  ❌ (email antigo)
Clerk: Não vinculado
```

### Depois do SQL

```
Email: contacto.primeflow@gmail.com  ✅ (email atualizado)
Clerk: Ainda não vinculado (precisa fazer signup)
```

### Depois do Signup no Clerk

```
Email: contacto.primeflow@gmail.com  ✅
Clerk: user_xyz123  ✅ (vinculado!)
Role: admin  ✅ (mantido)
```

---

## ⚠️ Importante

- ✅ Role **admin** é mantido
- ✅ Dados do banco preservados
- ✅ Apenas o email muda
- ⚠️ Não esqueça de fazer signup no Clerk após executar o SQL

---

## 🎯 Checklist

- [ ] Executar SQL no Neon
- [ ] Verificar email atualizado
- [ ] Fazer signup no Clerk com novo email
- [ ] Testar login
- [ ] Confirmar permissões de admin funcionando

**Pronto!** 🎉
