-- Step 1: Delete duplicate cart entries, keeping only the most recent one per user
DELETE FROM carts
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM carts
  ORDER BY user_id, updated_at DESC
);

-- Step 2: Add unique constraint to prevent duplicate carts per user in future
ALTER TABLE carts ADD CONSTRAINT carts_user_id_unique UNIQUE (user_id);