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
import { Textarea } from "@/components/ui/textarea"
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
import { Trash2, Image as ImageIcon, X, Upload } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { MediaAssetModal } from "@/components/admin/posts/media-asset-modal"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters.",
    }),
    description: z.string().optional(),
    icon: z.any().optional(),
    iconUrl: z.string().optional(),
})

interface CategoryFormProps {
    initialData?: z.infer<typeof formSchema> & { id?: string, icon_url?: string }
    onSubmit: (values: FormData) => void
    onDelete?: () => void
}

export function CategoryForm({ initialData, onSubmit, onDelete }: CategoryFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name || "",
            slug: initialData.slug || "",
            description: initialData.description || "",
            iconUrl: initialData.icon_url || "",
        } : {
            name: "",
            slug: "",
            description: "",
            iconUrl: "",
        },
    })

    const isEditing = !!initialData
    const watchedName = form.watch("name")
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.icon_url || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            setPreviewUrl(URL.createObjectURL(file))
            form.setValue("iconUrl", "") // Clear library URL if new file uploaded
        }
    }

    function handleLibrarySelect(url: string) {
        form.setValue("iconUrl", url)
        setPreviewUrl(url)
        setSelectedImage(null) // Clear uploaded file if library selected
    }

    const onFormSubmit = (values: z.infer<typeof formSchema>) => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("slug", values.slug)
        formData.append("description", values.description || "")
        formData.append("iconUrl", values.iconUrl || "")

        if (selectedImage) {
            formData.append("icon", selectedImage)
        }

        if (isEditing && initialData?.icon_url) {
            formData.append("currentIconUrl", initialData.icon_url)
        }

        onSubmit(formData)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
                <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                    <CardHeader className="px-6 pt-0 pb-4">
                        <CardTitle>{isEditing ? "Edit Category" : "Create Category"}</CardTitle>
                        <CardDescription>
                            {isEditing ? "Update existing category details." : "Add a new category to organize your posts."}
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
                                        <Input placeholder="e.g. Technology" {...field} />
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
                                        <Input placeholder="e.g. technology" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The URL-friendly version of the name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe this category..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Category Icon/Image</FormLabel>
                            <div className="space-y-4">
                                {previewUrl ? (
                                    <div className="relative group w-40 h-40 rounded-xl overflow-hidden border bg-muted shadow-sm mx-auto sm:mx-0">
                                        <img
                                            src={previewUrl}
                                            alt="Category Preview"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <MediaAssetModal onSelect={handleLibrarySelect}>
                                                <Button variant="secondary" size="icon" type="button" className="h-8 w-8 rounded-full">
                                                    <ImageIcon className="h-4 w-4" />
                                                </Button>
                                            </MediaAssetModal>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                type="button"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => {
                                                    setPreviewUrl(null)
                                                    setSelectedImage(null)
                                                    form.setValue("iconUrl", "")
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                                        <MediaAssetModal onSelect={handleLibrarySelect}>
                                            <div className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group p-4">
                                                <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary text-center">Pick from Library</span>
                                            </div>
                                        </MediaAssetModal>

                                        <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group p-4">
                                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary text-center">Upload New</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    {isEditing && onDelete ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" type="button">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Category
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this
                                        category and remove it from our servers.
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
                        <Link href="/admin/categories">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit">{isEditing ? "Update Category" : "Save Category"}</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
