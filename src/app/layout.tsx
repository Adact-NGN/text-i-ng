import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Logo } from "@/components/Logo";
import { SessionProvider } from "@/components/SessionProvider";
import { UserMenu } from "@/components/UserMenu";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VersionDisplay } from "@/components/VersionDisplay";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TextiNG - SMS Messaging Platform",
  description:
    "Send SMS messages using Twilio. Professional SMS messaging platform by NG Nordic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="sms-app-theme">
          <SessionProvider>
            <div className="min-h-screen bg-background overflow-x-hidden">
              <header className="bg-card shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                      <Link href="/" className="cursor-pointer">
                        <Logo />
                      </Link>
                      <Navigation />
                    </div>
                    <div className="flex items-center space-x-4">
                      <VersionDisplay />
                      <ThemeToggle />
                      <UserMenu />
                    </div>
                  </div>
                </div>
              </header>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </SessionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
