"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Lock, Save } from "lucide-react"
import { toast } from "sonner"
import { updatePassword } from "@/app/(auth)/actions"

const passwordSchema = z.object({
    currentPassword: z.string().min(1, {
        message: "Current password is required.",
    }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
    confirmPassword: z.string().min(1, {
        message: "Confirm password is required.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
})

export function PasswordForm() {
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof passwordSchema>) {
        setIsSaving(true)
        try {
            const formData = new FormData()
            formData.append("currentPassword", values.currentPassword)
            formData.append("password", values.password)
            formData.append("confirmPassword", values.confirmPassword)

            const result = await updatePassword(formData)

            if (result && !result.success) {
                if (result.message === 'Invalid current password') {
                    form.setError('currentPassword', { message: result.message })
                } else if (result.message?.includes('New password')) {
                    form.setError('password', { message: result.message })
                } else {
                    toast.error(result.message || "Failed to update password")
                }
                return
            }

            toast.success("Password updated successfully!")
            form.reset()
        } catch (error: any) {
            toast.error("An unexpected error occurred")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSaving} className="font-semibold shadow-md px-8">
                        <Lock className="mr-2 h-4 w-4" /> {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
