"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    PlusCircle,
    Users,
    MessageSquare,
    BarChart3,
    Tags,
    Tag,
    Image as LucideImage,
    UserCircle
} from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Posts",
        href: "/admin/posts",
        icon: FileText,
    },
    {
        title: "New Post",
        href: "/admin/posts/new",
        icon: PlusCircle,
    },
    {
        title: "Categories",
        href: "/admin/categories",
        icon: Tags,
    },
    {
        title: "Tags",
        href: "/admin/tags",
        icon: Tag,
    },
    {
        title: "Media",
        href: "/admin/media",
        icon: LucideImage,
    },
    {
        title: "Comments",
        href: "/admin/comments",
        icon: MessageSquare,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
    {
        title: "Profile",
        href: "/admin/profile",
        icon: UserCircle,
    },
]

export function Sidebar({ className, siteName }: { className?: string, siteName?: string }) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-muted/40", className)}>
            <div className="space-y-4 py-4">
                <div className="px-6 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-foreground truncate">
                        {siteName || "Admin Panel"}
                    </h2>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                    pathname === item.href || pathname.startsWith(item.href + "/")
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-auto px-6 py-4 border-t">
                <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
