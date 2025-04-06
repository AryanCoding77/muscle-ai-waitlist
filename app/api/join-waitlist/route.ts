import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("waitlist_users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already on our waitlist!" },
        { status: 400 }
      );
    }

    // Insert using direct insert instead of function since the function isn't working
    const { data, error } = await supabase
      .from("waitlist_users")
      .insert([{ name, email }]);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Successfully joined the waitlist!",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
