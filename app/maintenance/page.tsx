import { Button } from "@/components/ui/button"
import { Globe, Mail, Instagram, Twitter, Facebook } from "lucide-react"
import Link from "next/link"
import { getSiteSettings } from "../admin/settings/actions"

export const metadata = {
    title: "Maintenance Mode | BlogCMS",
    description: "Our site is currently undergoing scheduled maintenance.",
}

export default async function MaintenancePage() {
    const { data: settings } = await getSiteSettings()

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="space-y-6 max-w-2xl">
                <div className="relative inline-block">
                    <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full animate-pulse" />
                    <Globe className="relative h-20 w-20 text-primary mx-auto mb-4" />
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    We'll Be <span className="text-primary italic">Back</span> Soon
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                    {settings?.site_name || "BlogCMS"} is currently undergoing scheduled maintenance to improve your experience.
                    We appreciate your patience and will be back online shortly.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {settings?.admin_email && (
                        <Button variant="outline" asChild className="rounded-full px-6">
                            <a href={`mailto:${settings.admin_email}`}>
                                <Mail className="mr-2 h-4 w-4" /> Contact Support
                            </a>
                        </Button>
                    )}
                    <Button asChild className="rounded-full px-6 font-semibold shadow-lg">
                        <Link href="/login">
                            Admin Login
                        </Link>
                    </Button>
                </div>

                <div className="pt-12 space-y-4">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Follow our updates</p>
                    <div className="flex items-center justify-center gap-6">
                        {settings?.facebook_url && (
                            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-6 w-6" />
                            </a>
                        )}
                        {settings?.twitter_url && (
                            <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-6 w-6" />
                            </a>
                        )}
                        {settings?.instagram_url && (
                            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-6 w-6" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="pt-12 text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} {settings?.site_name || "BlogCMS"}. All rights reserved.
                </div>
            </div>
        </div>
    )
}
