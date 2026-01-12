import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSiteSettings } from "./admin/settings/actions";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();

  const siteName = settings?.site_name || "BlogCMS";

  return {
    title: siteName,
    description: settings?.meta_description || settings?.site_description || "A premium headless CMS built with Next.js and Supabase.",
    keywords: settings?.keywords || "nextjs, cms, blog",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: settings } = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <LayoutWrapper type="navbar">
          <Navbar user={user} siteName={settings?.site_name} />
        </LayoutWrapper>
        <main className="flex-1">
          {children}
        </main>
        <Toaster richColors closeButton position="top-right" />
        <LayoutWrapper type="footer">
          <footer className="py-6 md:px-8 border-t mt-auto bg-muted/50">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row px-4">
              <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} {settings?.site_name || "BlogCMS"}. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
              </div>
            </div>
          </footer>
        </LayoutWrapper>
      </body>
    </html>
  );
}
