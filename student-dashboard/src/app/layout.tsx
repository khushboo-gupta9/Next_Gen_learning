import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aetheria | Next-Gen Student Learning Dashboard",
  description: "A highly animated, responsive student dashboard prototype styled with modern glassmorphic designs, powered by server-rendered Supabase database courses, and smooth spring physics.",
  keywords: ["Next.js", "Dashboard", "Student Analytics", "Tailwind CSS", "Framer Motion", "Supabase"],
  authors: [{ name: "Khush Singh" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-accent-purple/35 selection:text-white">
        {children}
      </body>
    </html>
  );
}
