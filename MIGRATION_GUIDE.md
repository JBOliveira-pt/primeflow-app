# Migration Guide - Clerk Integration

Execute as migrations na ordem abaixo no **SQL Editor do Neon**:

## 1. Criar tabela de organizações

```sql
-- migrations/create_organizations_table.sql
```

Cria a tabela `organizations` para armazenar dados das empresas.

## 2. Adicionar foreign key de organizations em users

```sql
-- migrations/add_org_foreign_key.sql
```

Adiciona constraint de foreign key da tabela users para organizations.

## 3. Adicionar coluna created_by

```sql
-- migrations/add_created_by_columns.sql
```

Adiciona rastreamento de quem criou cada customer e invoice.

---

## Como executar

1. Acesse o painel do **Neon**
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo de cada arquivo SQL na ordem acima
4. Execute cada um clicando em **Run**

---

## Resultado esperado

Após as migrations:

- ✅ Primeiro usuário que se registrar no Clerk vira admin e cria uma organização
- ✅ Próximos usuários herdam a organização do admin
- ✅ Usuários criados pelo admin via dashboard recebem convite do Clerk
- ✅ Usuários só podem editar/deletar customers e invoices que eles criaram
- ✅ Admin pode editar/deletar tudo

---

## Cleanup (opcional)

Se quiser começar com banco limpo:

```sql
-- Deletar dados antigos (mantém estrutura)
DELETE FROM invoices;
DELETE FROM customers;
DELETE FROM users WHERE role != 'admin';
```
