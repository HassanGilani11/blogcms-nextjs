"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters.",
    }),
})

interface TagFormProps {
    initialData?: z.infer<typeof formSchema> & { id?: string }
    onSubmit: (values: z.infer<typeof formSchema>) => void
    onDelete?: () => void
}

export function TagForm({ initialData, onSubmit, onDelete }: TagFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
        },
    })

    const isEditing = !!initialData
    const watchedName = form.watch("name")

    // Auto-generate slug from name
    useEffect(() => {
        if (watchedName) {
            const slug = watchedName
                .toLowerCase()
                .trim()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            form.setValue("slug", slug)
        }
    }, [watchedName, form])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                    <CardHeader className="px-6 pt-0 pb-4">
                        <CardTitle>{isEditing ? "Edit Tag" : "Create Tag"}</CardTitle>
                        <CardDescription>
                            {isEditing ? "Update tag details." : "Add a new tag to organize your content."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 py-0 space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Next.js" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. nextjs" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The URL-friendly version of the name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    {isEditing && onDelete ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" type="button">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Tag
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this
                                        tag and remove it from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        <div /> /* Spacer */
                    )}
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/tags">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit">{isEditing ? "Update Tag" : "Save Tag"}</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
