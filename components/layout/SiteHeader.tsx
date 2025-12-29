import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-xl font-bold">
            Blog CMS
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/blog"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

