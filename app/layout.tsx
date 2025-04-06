import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muscle AI - Join the Waitlist",
  description:
    "Sign up for the Muscle AI waitlist and be first to experience the future of fitness technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
