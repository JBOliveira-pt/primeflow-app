-- Add foreign key constraint from users to organizations
-- This migration should be run AFTER create_organizations_table.sql

-- Add constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_users_organization'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT fk_users_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES organizations(id) 
        ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
