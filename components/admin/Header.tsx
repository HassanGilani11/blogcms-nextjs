"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Bell } from "lucide-react"
import { logout } from "@/app/(auth)/actions"

interface HeaderProps {
    onMenuClick: () => void
    user: any
    profile: any
}

export function Header({ onMenuClick, user, profile }: HeaderProps) {
    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || "AD"

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm w-full">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
            </Button>

            <div className="w-full flex-1">
                {/* Breadcrumbs or Title could go here */}
                <span className="font-semibold text-lg hidden md:block">Dashboard</span>
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9 border shadow-sm transition-transform hover:scale-105">
                            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{profile?.full_name || "Admin User"}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email || "admin@example.com"}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/admin/profile">
                        <DropdownMenuItem className="cursor-pointer">
                            Profile
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/admin/settings">
                        <DropdownMenuItem className="cursor-pointer">
                            Settings
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => logout()}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    >
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
