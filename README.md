# Muscle AI Waitlist

A modern waitlist landing page for Muscle AI, built with Next.js, Tailwind CSS, and Supabase.

## Setup Instructions

1. First, install the dependencies:

```bash
npm install
# or
yarn install
```

2. Create a Supabase project at https://supabase.com and get your project URL and anon key.

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Create the waitlist table in your Supabase database:

   **Run this SQL in the Supabase SQL Editor:**

   ```sql
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

   -- Disable Row Level Security (simplest solution for a public waitlist)
   ALTER TABLE public.waitlist_users DISABLE ROW LEVEL SECURITY;

   -- Grant access to authenticated and anon users
   GRANT ALL ON public.waitlist_users TO authenticated;
   GRANT ALL ON public.waitlist_users TO anon;
   ```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Troubleshooting

### "new row violates row-level security policy for table waitlist_users"

If you see this error, it means the Row-Level Security (RLS) policies are preventing insertions. Follow these steps to fix it:

1. Go to the SQL Editor in your Supabase dashboard
2. Run this SQL to disable RLS for the waitlist table:

```sql
-- Disable Row Level Security
ALTER TABLE public.waitlist_users DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.waitlist_users TO authenticated;
GRANT ALL ON public.waitlist_users TO anon;
```

### Hydration Errors

If you see React hydration errors in the console, these are harmless in development mode and should not affect the functionality of the app.

## Features

- Modern, responsive design
- Email and name collection
- Supabase database integration
- Form validation
- Loading states
- Success/error notifications
- Gradient text and button effects

## Technologies Used

- Next.js 14
- React 18
- Tailwind CSS
- Supabase
- TypeScript
- React Hot Toast for notifications

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
