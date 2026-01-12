"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2, RotateCcw, XOctagon, MoreHorizontal, Edit, MessageSquare, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deletePost, restorePost, deletePostPermanently } from "./actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PostsTableProps {
    initialPosts: any[]
}

export function PostsTable({ initialPosts }: PostsTableProps) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.categories?.some((c: any) => c.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))

            // Core filtering based on deletion status
            const isDeleted = post.deleted_at !== null

            if (activeTab === "trash") {
                return matchesSearch && isDeleted
            }

            // If not in trash tab, we only want active posts
            if (isDeleted) return false

            const matchesTab =
                activeTab === "all" ||
                post.status.toLowerCase() === activeTab.toLowerCase()

            return matchesSearch && matchesTab
        })
    }, [initialPosts, searchTerm, activeTab])

    const counts = useMemo(() => {
        return {
            all: initialPosts.filter(p => !p.deleted_at).length,
            published: initialPosts.filter(p => !p.deleted_at && p.status === "published").length,
            draft: initialPosts.filter(p => !p.deleted_at && p.status === "draft").length,
            trash: initialPosts.filter(p => p.deleted_at).length,
        }
    }, [initialPosts])

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to move this post to trash?")) return
        const result = await deletePost(id)
        if (result.success) {
            toast.success("Post moved to trash")
            router.refresh()
        } else {
            toast.error(result.message || "Failed to delete post")
        }
    }

    async function handleRestore(id: string) {
        const result = await restorePost(id)
        if (result.success) {
            toast.success("Post restored to drafts")
            router.refresh()
        } else {
            toast.error(result.message || "Failed to restore post")
        }
    }

    async function handlePermanentDelete(id: string) {
        if (!confirm("Are you sure you want to permanently delete this post? This action cannot be undone.")) return
        const result = await deletePostPermanently(id)
        if (result.success) {
            toast.success("Post permanently deleted")
            router.refresh()
        } else {
            toast.error(result.message || "Failed to delete post")
        }
    }

    return (
        <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="p-6 pb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <CardTitle>All Posts</CardTitle>
                            <Badge variant="secondary" className="font-normal">{filteredPosts.length}</Badge>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <div className="relative w-full md:w-[300px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search posts..."
                                    className="pl-8 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <TabsList className="h-auto p-0 bg-transparent gap-2">
                        <TabsTrigger
                            value="all"
                            className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium whitespace-nowrap"
                        >
                            All
                        </TabsTrigger>
                        <TabsTrigger
                            value="published"
                            className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                        >
                            Published
                            {counts.published > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/20 text-primary border-none">{counts.published}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger
                            value="draft"
                            className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                        >
                            Drafts
                            {counts.draft > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/20 text-primary border-none">{counts.draft}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger
                            value="trash"
                            className="h-8 px-4 rounded-full data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive text-muted-foreground hover:text-destructive transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                        >
                            Trash
                            {counts.trash > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-destructive/20 text-destructive border-none">{counts.trash}</Badge>}
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="font-medium">
                                                {post.title}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={post.author?.avatar_url} />
                                                        <AvatarFallback>{post.author?.full_name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-muted-foreground">{post.author?.full_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {post.categories && post.categories.length > 0 ? (
                                                        post.categories.map((c: any) => (
                                                            <Badge key={c.category.id} variant="outline" className="font-normal">
                                                                {c.category.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <Badge variant="outline" className="font-normal">
                                                            Uncategorized
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {post.tags?.map((tag: string) => (
                                                        <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={post.status === "published" ? "default" : "secondary"}
                                                    className={post.status === "published" ? "bg-green-500 hover:bg-green-600 text-white border-none" : ""}
                                                >
                                                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground whitespace-nowrap">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal">
                                                    {post.view_count || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {post.deleted_at ? (
                                                            <>
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer flex items-center w-full"
                                                                    onClick={() => handleRestore(post.id)}
                                                                >
                                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                                    Restore
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                                    onClick={() => handlePermanentDelete(post.id)}
                                                                >
                                                                    <XOctagon className="mr-2 h-4 w-4" />
                                                                    Delete Permanently
                                                                </DropdownMenuItem>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/posts/${post.id}/edit`} className="cursor-pointer flex items-center w-full">
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                                    onClick={() => handleDelete(post.id)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Move to Trash
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No posts found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Tabs>
        </Card>
    )
}
