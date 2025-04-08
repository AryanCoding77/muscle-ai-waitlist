"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  // Handle hydration issues by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      // Instead of directly inserting with Supabase client, use a fetch request
      // that can be handled by a server action or API route
      const response = await fetch("/api/join-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to join waitlist");
      }

      console.log("Success! Response:", result);
      setSuccess(true);
      toast.success("Successfully joined the waitlist!");
      setEmail("");
      setName("");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setErrorMessage(
        error.message || "Error joining waitlist. Please try again."
      );
      toast.error(error.message || "Error joining waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Return empty div while component is mounting to prevent hydration errors
  if (!mounted) {
    return <div></div>;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-4 pt-24">
      <div className="max-w-md w-full space-y-12 mx-auto mt-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Join the waitlist for the</h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-8">
            Muscle AI System!
          </h2>
          <p className="text-gray-400 mb-8">
            Be the first to experience the future of fitness technology.
          </p>
        </div>

        {success ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">
              We've added you to our waiting list!
            </h3>
            <p className="text-gray-400">
              We'll let you know when Muscle AI is ready.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>

            {errorMessage && (
              <div className="bg-red-900/40 border border-red-800 text-red-200 rounded-lg p-3 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Joining..." : "Join the waitlist"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-400 text-sm mt-8">
          Muscle AI is coming soon. We'll notify you when we're ready.
        </p>
      </div>

      <div className="w-full max-w-4xl mt-12">
        <video
          controls
          className="w-full rounded-lg shadow-xl"
          preload="metadata"
          controlsList="nodownload"
          autoPlay={false}
        >
          <source
            src="/video/Recording 2025-03-24 232004.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <Toaster position="bottom-center" />
    </main>
  );
}
