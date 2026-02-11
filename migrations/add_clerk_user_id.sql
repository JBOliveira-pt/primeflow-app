-- Migration: Add clerk_user_id to users table
-- Execute este script no seu banco de dados Neon

-- Step 1: Adicionar coluna clerk_user_id
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);

-- Step 2: Criar índice único para clerk_user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_id 
ON users(clerk_user_id) 
WHERE clerk_user_id IS NOT NULL;

-- Step 3: Adicionar comentário na coluna
COMMENT ON COLUMN users.clerk_user_id IS 'Clerk user ID for authentication sync';

-- Step 4: Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
