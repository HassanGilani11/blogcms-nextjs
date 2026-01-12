"use client"

import { usePathname } from "next/navigation"

interface LayoutWrapperProps {
    children: React.ReactNode
    type: 'navbar' | 'footer'
}

export function LayoutWrapper({ children, type }: LayoutWrapperProps) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    if (isAdmin) return null

    return <>{children}</>
}
