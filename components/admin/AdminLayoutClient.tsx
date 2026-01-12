"use client"

import { useState } from "react"
import { Sidebar } from "@/components/admin/Sidebar"
import { Header } from "@/components/admin/Header"
import { cn } from "@/lib/utils"

interface AdminLayoutClientProps {
    children: React.ReactNode
    user: any
    profile: any
    settings?: any
}

export function AdminLayoutClient({ children, user, profile, settings }: AdminLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-muted/10">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:block w-64 flex-shrink-0">
                <Sidebar className="h-full" siteName={settings?.site_name} />
            </aside>

            {/* Sidebar (Mobile Overlay) */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-300 md:hidden",
                    isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            >
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r shadow-lg transition-transform duration-300",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Sidebar siteName={settings?.site_name} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                    user={user}
                    profile={profile}
                />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
