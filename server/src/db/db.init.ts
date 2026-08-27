import dotenv from "dotenv";

dotenv.config({
  path: ".env.local"
});
import { Pool } from "pg";
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDB() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS blog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    post_url TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_blog_user_id
    ON blog(user_id);


    CREATE TABLE IF NOT EXISTS idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (
      status IN ('processing', 'failed', 'completed')
    ),
    result JSONB,

    CONSTRAINT unique_idempotency_key UNIQUE (key)
    );

    CREATE INDEX IF NOT EXISTS idx_idempotency_keys_user_id
    ON idempotency_keys(user_id);


    CREATE TABLE IF NOT EXISTS post (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,

    status TEXT NOT NULL CHECK (
        status IN ('draft', 'approved', 'rejected', 'published')
    ),

    blog_id UUID NOT NULL,

    x_post TEXT NOT NULL,
    instagram_post TEXT NOT NULL,
    linkedin_post TEXT NOT NULL,

    CONSTRAINT fk_post_blog
        FOREIGN KEY (blog_id)
        REFERENCES blog(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_post_user_id
    ON post(user_id);

    CREATE INDEX IF NOT EXISTS idx_post_blog_id
    ON post(blog_id);
  `;
  await db.query(createTableSql);

}
