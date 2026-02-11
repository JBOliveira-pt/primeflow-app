-- Migration: Atualizar email do admin principal
-- Execute este script no seu banco de dados Neon

-- Step 1: Verificar o usuário atual
SELECT id, name, email, role, clerk_user_id
FROM users
WHERE email = 'jeisonoliveira@primeflow.com';

-- Step 2: Atualizar o email
UPDATE users
SET email = 'contacto.primeflow@gmail.com'
WHERE email = 'jeisonoliveira@primeflow.com';

-- Step 3: Verificar a alteração
SELECT id, name, email, role, clerk_user_id
FROM users
WHERE email = 'contacto.primeflow@gmail.com';

-- Step 4: (Opcional) Atualizar o nome se necessário
-- UPDATE users
-- SET name = 'Seu Novo Nome'
-- WHERE email = 'contacto.primeflow@gmail.com';

-- Resultado esperado:
-- ✅ Email alterado de jeisonoliveira@primeflow.com → contacto.primeflow@gmail.com
-- ✅ Role mantido como 'admin'
-- ✅ clerk_user_id NULL (será vinculado no primeiro login)
