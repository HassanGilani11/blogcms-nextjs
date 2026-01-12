"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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
import {
    Select as UISelect,
    SelectContent as UISelectContent,
    SelectItem as UISelectItem,
    SelectTrigger as UISelectTrigger,
    SelectValue as UISelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Save, User as UserIcon, Mail, Shield, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getUser, updateUser, deleteUser } from "../../actions"

const userSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    role: z.string().min(1, {
        message: "Please select a role.",
    }),
    bio: z.string().optional(),
})

type UserFormValues = z.infer<typeof userSchema>

export default function EditUserPage() {
    const params = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userAvatar, setUserAvatar] = useState("")
    const userId = params.id as string

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            bio: "",
        },
    })

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return

            const result = await getUser(userId)
            if (result.success && result.data) {
                const userData = result.data
                form.reset({
                    name: userData.full_name || "",
                    email: userData.email || "",
                    role: (userData.role?.toLowerCase() === "user" ? "subscriber" : (userData.role || "subscriber").toLowerCase()),
                    bio: userData.professional_bio || "",
                })
                setUserAvatar(userData.avatar_url || "")
            } else {
                toast.error("Failed to load user data")
                router.push("/admin/users")
            }
            setIsLoading(false)
        }

        fetchUser()
    }, [userId, form, router])

    async function onSubmit(data: UserFormValues) {
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('email', data.email)
            formData.append('role', data.role)
            formData.append('professional_bio', data.bio || "")

            const result = await updateUser(userId, formData)

            if (result.success) {
                toast.success("User updated successfully!")
            } else {
                toast.error(result.message || "Failed to update user")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete() {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            setIsSubmitting(true)
            const result = await deleteUser(userId)
            if (result.success) {
                toast.success("User deleted successfully")
                router.push("/admin/users")
            } else {
                toast.error(result.message || "Failed to delete user")
                setIsSubmitting(false)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                Loading user data...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/users"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Users
                </Link>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-2 border-background shadow-lg">
                            <AvatarImage src={userAvatar} />
                            <AvatarFallback>{form.getValues("name")?.split(' ').map(n => n[0]).join('') || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold tracking-tight">Edit "{form.getValues("name")}"</h2>
                            <p className="text-muted-foreground">Update user permissions and profile information.</p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                            <div className="space-y-6">
                                <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                                    <CardHeader className="px-6 pt-0 pb-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <UserIcon className="h-5 w-5 text-primary" /> Profile Information
                                        </CardTitle>
                                        <CardDescription>
                                            Basic details about the user account.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 py-0 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                            <Input {...field} className="pl-10" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bio</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="A short bio about the user..." />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Briefly describe the user (optional).
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                                    <CardHeader className="px-6 pt-0 pb-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" /> Role & Permissions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-0 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>User Role</FormLabel>
                                                    <UISelect onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <UISelectTrigger>
                                                                <UISelectValue placeholder="Select a role" />
                                                            </UISelectTrigger>
                                                        </FormControl>
                                                        <UISelectContent>
                                                            <UISelectItem value="super admin">Super Admin</UISelectItem>
                                                            <UISelectItem value="admin">Admin</UISelectItem>
                                                            <UISelectItem value="editor">Editor</UISelectItem>
                                                            <UISelectItem value="author">Author</UISelectItem>
                                                            <UISelectItem value="subscriber">Subscriber</UISelectItem>
                                                        </UISelectContent>
                                                    </UISelect>
                                                    <FormDescription>
                                                        Defines what sections of the admin the user can access.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm border-none ring-1 ring-border/50 py-6 border-destructive/20 bg-destructive/5">
                                    <CardHeader className="px-6 pt-0 pb-4 text-destructive">
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Danger Zone</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-0">
                                        <Button
                                            variant="destructive"
                                            className="w-full font-bold shadow-sm"
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isSubmitting}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User Account
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 border-t pt-6">
                            <Link href="/admin/users">
                                <Button variant="outline" type="button" className="font-semibold shadow-sm">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting} className="font-semibold shadow-md bg-primary hover:bg-primary/90">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
