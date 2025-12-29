import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  title: string;
  href: string;
};

const navItems: NavItem[] = [
  { title: "Blog", href: "/blog" },
  { title: "Categories", href: "#" },
];

export function MainNav({ className }: { className?: string }) {
  return (
    <nav className={cn("flex gap-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium transition-colors hover:text-foreground/80"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

