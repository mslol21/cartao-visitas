import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres.fyexdnjvxphhgestfvrt:sqdIrWgKVn21%40%40@aws-1-sa-east-1.pooler.supabase.com:6543/postgres",
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    const sql = `
      -- Add business_hours column to profiles table
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}'::jsonb;

      -- Comment on column
      COMMENT ON COLUMN public.profiles.business_hours IS 'Stores business hours as a JSON object with days as keys';
    `;
    
    await client.query(sql);
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Error applying migration:', err);
  } finally {
    await client.end();
  }
}

run();
