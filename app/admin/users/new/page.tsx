"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { ChevronLeft, UserPlus, User, Mail, Shield, Lock, Save } from "lucide-react"
import { toast } from "sonner"
import { createUser } from "../actions"

const newUserSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    role: z.string().min(1, {
        message: "Please select a role.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

type UserFormValues = z.infer<typeof newUserSchema>

export default function NewUserPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<UserFormValues>({
        resolver: zodResolver(newUserSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "subscriber",
            password: "",
        },
    })

    async function onSubmit(data: UserFormValues) {
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('email', data.email)
            formData.append('password', data.password)
            formData.append('role', data.role)

            const result = await createUser(formData)

            if (result.success) {
                toast.success("User created successfully!")
                router.push("/admin/users")
            } else {
                toast.error(result.message || "Failed to create user")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
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
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">Add New User</h2>
                        <p className="text-muted-foreground">Create a new account and assign a role.</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                            <div className="space-y-6">
                                <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                                    <CardHeader className="px-6 pt-0 pb-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-primary" /> User Information
                                        </CardTitle>
                                        <CardDescription>
                                            Basic details for the new user account.
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
                                                        <Input placeholder="John Doe" {...field} />
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
                                                            <Input placeholder="john@example.com" {...field} className="pl-10" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Initial Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                            <Input type="password" {...field} className="pl-10" />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Set a temporary password for the user.
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
                                            <Shield className="h-5 w-5 text-primary" /> Role Assignment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-0 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>User Role</FormLabel>
                                                    <UISelect onValueChange={field.onChange} defaultValue={field.value}>
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
                                                        Grant permissions based on the role.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 border-t pt-6">
                            <Link href="/admin/users">
                                <Button variant="outline" type="button" className="font-semibold shadow-sm">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting} className="font-semibold shadow-md bg-primary hover:bg-primary/90">
                                <UserPlus className="mr-2 h-4 w-4" /> {isSubmitting ? "Creating..." : "Create User"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
