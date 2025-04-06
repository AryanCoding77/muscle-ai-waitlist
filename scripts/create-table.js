// Script to create the waitlist_users table in Supabase
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing Supabase credentials.");
  console.error("Please make sure your .env.local file contains:");
  console.error("NEXT_PUBLIC_SUPABASE_URL=your_supabase_url");
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key");
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Creating waitlist_users table...");

  try {
    // Use raw SQL to create the table and set permissions
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
      -- Create extension for UUID generation if it doesn't exist
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      -- Drop the table if it exists to ensure a clean start
      DROP TABLE IF EXISTS public.waitlist_users;
      
      -- Create the waitlist_users table
      CREATE TABLE public.waitlist_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL
      );
      
      -- Grant access to authenticated and anon users
      GRANT ALL ON public.waitlist_users TO authenticated;
      GRANT ALL ON public.waitlist_users TO anon;
      
      -- Enable Row Level Security
      ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;
      
      -- Create policy to allow inserts from anyone (anonymous users)
      CREATE POLICY insert_policy ON public.waitlist_users 
        FOR INSERT 
        TO anon, authenticated
        WITH CHECK (true);
      
      -- Create policy to allow admin users to view all data
      CREATE POLICY select_policy ON public.waitlist_users 
        FOR SELECT 
        TO authenticated 
        USING (true);
      `,
    });

    if (error) {
      console.error("Error creating table:", error.message);
      process.exit(1);
    }

    // Test the connection by inserting a test record
    const { data, error: insertError } = await supabase
      .from("waitlist_users")
      .insert([{ email: "test@example.com", name: "Test User" }])
      .select();

    if (insertError) {
      if (insertError.code === "42P01") {
        console.error("Error: Table creation failed - table does not exist");
        console.error(
          "Please run the SQL script manually in the Supabase dashboard"
        );
      } else {
        console.error("Error testing table:", insertError.message);
      }
      process.exit(1);
    }

    console.log("✅ Waitlist table created and tested successfully!");
    console.log("Test data inserted:", data);

    // Clean up test data
    await supabase
      .from("waitlist_users")
      .delete()
      .eq("email", "test@example.com");

    console.log("Test data cleaned up.");
    console.log("Your waitlist system is ready to use!");
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

main();
