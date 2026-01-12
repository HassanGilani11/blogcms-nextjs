"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu, LogOut, User } from "lucide-react"
import { logout } from "@/app/(auth)/actions"
import { type User as SupabaseUser } from "@supabase/supabase-js"

interface NavbarProps {
    user: SupabaseUser | null
    siteName?: string
}

export function Navbar({ user, siteName = "BlogCMS" }: NavbarProps) {
    return (
        <nav className="border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2.5 transition-opacity hover:opacity-90">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Sparkles className="h-4 w-4 text-primary fill-primary/20" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">{siteName}</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                        >
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                        <Link
                            href="/blog"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                        >
                            Blog
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-2">
                                    <User className="h-4 w-4" /> Admin
                                </Button>
                            </Link>
                            <Button
                                onClick={() => logout()}
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" /> Log out
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="rounded-full px-6 shadow-sm font-medium hover:shadow-primary/25 transition-all">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}

                    <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
