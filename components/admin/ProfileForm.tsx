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
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Mail, Save } from "lucide-react"
import { toast } from "sonner"
import { updateProfile } from "@/app/(auth)/actions"

const profileSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    bio: z.string().optional(),
})

interface ProfileFormProps {
    initialData: {
        full_name: string | null
        email: string
        professional_bio: string | null
    }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData.full_name || "",
            email: initialData.email,
            bio: initialData.professional_bio || "",
        },
    })

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setIsSaving(true)
        try {
            const formData = new FormData()
            formData.append("fullName", values.name)
            formData.append("bio", values.bio || "")

            await updateProfile(formData)
            toast.success("Profile updated successfully!")
        } catch (error) {
            toast.error("Failed to update profile")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter your full name" />
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
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input {...field} className="pl-10" disabled />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-[10px] mt-1">
                                    Email cannot be changed here for security.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Professional Bio</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Tell us about yourself..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSaving} className="font-semibold shadow-md px-8">
                        <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
