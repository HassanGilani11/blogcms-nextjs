"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
    Settings,
    Globe,
    Search,
    Share2,
    Save,
    AlertCircle,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Github,
    Mail,
    FileText,
    Tag,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import { updateSiteSettings } from "@/app/admin/settings/actions"

const settingsSchema = z.object({
    siteName: z.string().min(2, "Site name is required"),
    siteDescription: z.string().min(10, "Description should be at least 10 characters"),
    adminEmail: z.string().email("Invalid email address"),
    metaTitle: z.string().min(2, "Meta title is too short").or(z.string().length(0)),
    metaDescription: z.string().min(5, "Meta description is too short").or(z.string().length(0)),
    keywords: z.string(),
    facebook_url: z.string().url("Invalid URL").or(z.literal("")),
    twitter_url: z.string().url("Invalid URL").or(z.literal("")),
    instagram_url: z.string().url("Invalid URL").or(z.literal("")),
    linkedin_url: z.string().url("Invalid URL").or(z.literal("")),
    youtube_url: z.string().url("Invalid URL").or(z.literal("")),
    github_url: z.string().url("Invalid URL").or(z.literal("")),
    maintenance_mode: z.boolean(),
})

type SettingsValues = z.infer<typeof settingsSchema>

interface SettingsFormProps {
    initialData: Partial<SettingsValues>
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<SettingsValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            siteName: initialData?.siteName || "BlogCMS",
            siteDescription: initialData?.siteDescription || "",
            adminEmail: initialData?.adminEmail || "",
            metaTitle: initialData?.metaTitle || "",
            metaDescription: initialData?.metaDescription || "",
            keywords: initialData?.keywords || "",
            facebook_url: initialData?.facebook_url || "",
            twitter_url: initialData?.twitter_url || "",
            instagram_url: initialData?.instagram_url || "",
            linkedin_url: initialData?.linkedin_url || "",
            youtube_url: initialData?.youtube_url || "",
            github_url: initialData?.github_url || "",
            maintenance_mode: initialData?.maintenance_mode || false,
        },
    })

    async function onSubmit(data: SettingsValues) {
        setIsSaving(true)
        try {
            const result = await updateSiteSettings(data)
            if (result.success) {
                toast.success(result.message || "Settings updated successfully!")
            } else {
                toast.error(result.message || "Failed to update settings")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">Site Settings</h2>
                        <p className="text-muted-foreground">Configure your website's global parameters and identity.</p>
                    </div>
                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto font-semibold shadow-md min-w-[160px]">
                        {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSaving ? "Saving..." : "Save All Changes"}
                    </Button>
                </div>

                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 h-11 rounded-full gap-1 overflow-x-auto">
                        <TabsTrigger value="general" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 h-9 transition-all">
                            <Globe className="h-4 w-4 mr-2" /> General
                        </TabsTrigger>
                        <TabsTrigger value="seo" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 h-9 transition-all">
                            <Search className="h-4 w-4 mr-2" /> SEO
                        </TabsTrigger>
                        <TabsTrigger value="social" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 h-9 transition-all">
                            <Share2 className="h-4 w-4 mr-2" /> Social Media
                        </TabsTrigger>
                        <TabsTrigger value="advanced" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 h-9 transition-all">
                            <Settings className="h-4 w-4 mr-2" /> Advanced
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6 focus-visible:ring-0">
                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle>Site Configuration</CardTitle>
                                <CardDescription>Update your site's basic information and branding.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-0 space-y-4">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="siteName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Site Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="adminEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Admin Email</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input {...field} type="email" className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="siteDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Site Description</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Textarea {...field} className="min-h-[120px] bg-background pl-10 pt-2.5" />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                This will be used as the default tagline for your site.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-6 focus-visible:ring-0">
                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle>SEO Defaults</CardTitle>
                                <CardDescription>Global search engine optimization settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-0 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="metaTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Default Meta Title</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input {...field} className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Recommended length: 50-60 characters.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="metaDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Default Meta Description</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Textarea {...field} className="min-h-[120px] bg-background pl-10 pt-2.5" />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Recommended length: 150-160 characters.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Global Keywords</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input {...field} placeholder="keyword1, keyword2, keyword3" className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Comma-separated list of keywords.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-6 focus-visible:ring-0">
                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle>Social Media Links</CardTitle>
                                <CardDescription>Connections to your official social platform profiles.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="facebook_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="https://facebook.com/your-page" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="twitter_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Twitter className="h-4 w-4 text-sky-500" /> Twitter (X)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="https://twitter.com/your-handle" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="instagram_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Instagram className="h-4 w-4 text-pink-500" /> Instagram
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="https://instagram.com/your-handle" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="linkedin_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Linkedin className="h-4 w-4 text-blue-700" /> LinkedIn
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="https://linkedin.com/company/your-page" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="youtube_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Youtube className="h-4 w-4 text-red-600" /> YouTube
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="https://youtube.com/@your-channel" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="github_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Github className="h-4 w-4 text-foreground" /> GitHub
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="https://github.com/your-repo" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6 focus-visible:ring-0">
                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6 bg-destructive/5">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle className="text-destructive flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" /> Maintenance Mode
                                </CardTitle>
                                <CardDescription>Actions in this section can affect the live site visibility.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-0">
                                <FormField
                                    control={form.control}
                                    name="maintenance_mode"
                                    render={({ field }) => (
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-background">
                                            <div className="space-y-0.5">
                                                <h4 className="font-bold">Enable Maintenance Mode</h4>
                                                <p className="text-sm text-muted-foreground">Redirect users to a temporary maintenance page.</p>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </div>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}
