import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Camera, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AvatarUpload } from "@/components/admin/AvatarUpload"
import { ProfileForm } from "@/components/admin/ProfileForm"
import { PasswordForm } from "@/components/admin/PasswordForm"

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // A user is "Verified" if they have verified_account === true OR if their email is confirmed
    const isVerified = profile?.verified_account || !!user.email_confirmed_at

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        : user.email?.substring(0, 2).toUpperCase()

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
                <p className="text-muted-foreground">Manage your personal information and account security.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                {/* Left Column: Avatar & Overview */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                        <CardHeader className="px-6 pt-0 pb-6 text-center">
                            <AvatarUpload currentUrl={profile?.avatar_url} initials={initials} />
                            <CardTitle>{profile?.full_name || "New User"}</CardTitle>
                            <CardDescription className="capitalize">{profile?.role || "User"} Account</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 py-0 space-y-4">
                            {isVerified && (
                                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20 text-sm">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-left">Verified Account</span>
                                        <span className="text-xs text-muted-foreground text-[10px] text-left">Email confirmed & secure access</span>
                                    </div>
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground text-center bg-muted/30 p-2 rounded italic">
                                Last updated: {new Date(profile?.updated_at).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Forms */}
                <div className="space-y-8">
                    {/* Profile Details */}
                    <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                        <CardHeader className="px-6 pt-0 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Personal Information
                            </CardTitle>
                            <CardDescription>Update your basic profile details.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 py-0">
                            <ProfileForm initialData={{
                                full_name: profile?.full_name,
                                email: user.email!,
                                professional_bio: profile?.professional_bio
                            }} />
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                        <CardHeader className="px-6 pt-0 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" /> Account Security
                            </CardTitle>
                            <CardDescription>Update your password to stay secure.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 py-0">
                            <PasswordForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
