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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createPost, updatePost } from "@/app/admin/posts/actions"
import { MediaAssetModal } from "./media-asset-modal"
import { Check, ChevronsUpDown, Trash2, Image as ImageIcon, X, Upload } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters.",
    }),
    content: z.string().min(1, {
        message: "Content cannot be empty.",
    }),
    excerpt: z.string().optional(),
    featuredImage: z.any().optional(),
    galleryImage: z.any().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.string().optional(),
    author: z.string().min(1, {
        message: "Please select an author.",
    }),
    date: z.string(),
    status: z.enum(["draft", "published", "pending"]),
    allowComments: z.boolean(),
})

interface PostFormProps {
    initialData?: any
    categories: { label: string, value: string }[]
    authors: { label: string, value: string }[]
    onSubmit?: (values: z.infer<typeof formSchema>) => void
    onDelete?: () => void
}

export function PostForm({ initialData, categories, authors, onSubmit, onDelete }: PostFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            title: initialData.title || "",
            slug: initialData.slug || "",
            content: initialData.content || "",
            excerpt: initialData.excerpt || "",
            categories: initialData.categories || [],
            tags: initialData.tags || "",
            author: initialData.author_id || "",
            date: initialData.published_at ? new Date(initialData.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: initialData.status || "draft",
            allowComments: initialData.allow_comments ?? true,
            featuredImage: initialData.featured_image_url || null,
            galleryImage: initialData.gallery_image_url || null,
        } : {
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            categories: [],
            tags: "",
            date: new Date().toISOString().split('T')[0],
            status: "draft",
            allowComments: true,
            featuredImage: null,
            galleryImage: null,
        },
    })

    const isEditing = !!initialData
    const watchedTitle = form.watch("title")

    // Auto-generate slug from title
    useEffect(() => {
        if (watchedTitle) {
            const slug = watchedTitle
                .toLowerCase()
                .trim()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            form.setValue("slug", slug)
        }
    }, [watchedTitle, form])

    async function handleFormSubmit(values: z.infer<typeof formSchema>) {
        if (onSubmit) {
            return onSubmit(values)
        }

        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('slug', values.slug)
        formData.append('content', values.content)
        formData.append('excerpt', values.excerpt || "")
        formData.append('status', values.status)
        formData.append('categoryIds', JSON.stringify(values.categories || []))
        formData.append('authorId', values.author)
        formData.append('allowComments', String(values.allowComments))
        formData.append('tags', values.tags || "")
        formData.append('date', values.date)

        if (values.featuredImage) {
            formData.append('featuredImage', values.featuredImage)
        }

        if (values.galleryImage) {
            formData.append('galleryImage', values.galleryImage)
        }

        if (isEditing) {
            formData.append('currentImageUrl', initialData.featured_image_url || "")
            formData.append('currentGalleryUrl', initialData.gallery_image_url || "")
            const result = await updatePost(initialData.id, formData)
            if (result.success) {
                toast.success("Post updated successfully")
                router.push("/admin/posts")
                router.refresh()
            } else {
                toast.error(result.message || "Failed to update post")
            }
        } else {
            const result = await createPost(formData)
            if (result.success) {
                toast.success("Post created successfully")
                router.push("/admin/posts")
                router.refresh()
            } else {
                toast.error(result.message || "Failed to create post")
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle>Post Details</CardTitle>
                                <CardDescription>
                                    The main content of your post.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-0 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter post title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Excerpt (Short Summary)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter a brief summary..." {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                A short summary used in blog listings.
                                            </FormDescription>
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
                                                <Input placeholder="post-url-slug" {...field} />
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
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle>Media</CardTitle>
                                <CardDescription>
                                    Manage images for your post. Click an image area to pick from library.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-0 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="featuredImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Featured Image</FormLabel>
                                            <div className="space-y-4">
                                                {field.value ? (
                                                    <div className="relative group aspect-video rounded-xl overflow-hidden border bg-muted shadow-sm">
                                                        <img
                                                            src={typeof field.value === 'string' ? field.value : URL.createObjectURL(field.value)}
                                                            alt="Featured Preview"
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <MediaAssetModal onSelect={(url) => field.onChange(url)}>
                                                                <Button variant="secondary" size="sm" type="button" className="gap-2">
                                                                    <ImageIcon className="h-4 w-4" /> Change
                                                                </Button>
                                                            </MediaAssetModal>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                type="button"
                                                                onClick={() => field.onChange(null)}
                                                            >
                                                                <X className="h-4 w-4" /> Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <MediaAssetModal onSelect={(url) => field.onChange(url)}>
                                                            <div className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                                                                <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                                                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Pick from Library</span>
                                                            </div>
                                                        </MediaAssetModal>
                                                        <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                                                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                                            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Upload New</span>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                                            />
                                                        </label>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="galleryImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gallery Image (Optional)</FormLabel>
                                            <div className="space-y-4">
                                                {field.value ? (
                                                    <div className="relative group aspect-video rounded-xl overflow-hidden border bg-muted shadow-sm">
                                                        <img
                                                            src={typeof field.value === 'string' ? field.value : URL.createObjectURL(field.value)}
                                                            alt="Gallery Preview"
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <MediaAssetModal onSelect={(url) => field.onChange(url)}>
                                                                <Button variant="secondary" size="sm" type="button" className="gap-2">
                                                                    <ImageIcon className="h-4 w-4" /> Change
                                                                </Button>
                                                            </MediaAssetModal>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                type="button"
                                                                onClick={() => field.onChange(null)}
                                                            >
                                                                <X className="h-4 w-4" /> Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <MediaAssetModal onSelect={(url) => field.onChange(url)}>
                                                            <div className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                                                                <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                                                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Pick from Library</span>
                                                            </div>
                                                        </MediaAssetModal>
                                                        <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                                                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                                            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Upload New</span>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                                            />
                                                        </label>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-0 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select author" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {authors.map((author) => (
                                                        <SelectItem key={author.value} value={author.value}>
                                                            {author.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle>Taxonomy</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-0 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="categories"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Categories</FormLabel>
                                                <FormDescription>
                                                    Select one or more categories for this post.
                                                </FormDescription>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                                                {categories.map((category) => (
                                                    <FormField
                                                        key={category.value}
                                                        control={form.control}
                                                        name="categories"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={category.value}
                                                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                                                                >
                                                                    <FormControl>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                            checked={field.value?.includes(category.value)}
                                                                            onChange={(e) => {
                                                                                const checked = e.target.checked
                                                                                const updatedValue = checked
                                                                                    ? [...(field.value || []), category.value]
                                                                                    : field.value?.filter((value: string) => value !== category.value)
                                                                                field.onChange(updatedValue)
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal cursor-pointer w-full">
                                                                        {category.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Comma separated tags" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Separate tags with commas.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-none ring-1 ring-border/50 py-6">
                            <CardHeader className="px-6 pt-0 pb-4">
                                <CardTitle>Discussion</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-0">
                                <FormField
                                    control={form.control}
                                    name="allowComments"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Allow Comments</FormLabel>
                                                <FormDescription>
                                                    Enable comments on this post.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {isEditing && onDelete ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" type="button">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Post
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        post and remove your data from our servers.
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
                        <Link href="/admin/posts">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit">{isEditing ? "Update Post" : "Save Post"}</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
