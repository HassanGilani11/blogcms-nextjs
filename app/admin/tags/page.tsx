"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Plus, Tag, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getTags, deleteTag } from "./actions"
import { toast } from "sonner"

export default function TagsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [tags, setTags] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTags()
    }, [])

    async function fetchTags() {
        setIsLoading(true)
        const result = await getTags()
        if (result.success) {
            setTags(result.data)
        } else {
            toast.error(result.message || "Failed to fetch tags")
        }
        setIsLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this tag?")) return

        const result = await deleteTag(id)
        if (result.success) {
            toast.success(result.message)
            fetchTags()
        } else {
            toast.error(result.message || "Failed to delete tag")
        }
    }

    const filteredTags = useMemo(() => {
        return tags.filter((tag) =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm, tags])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
                    <p className="text-muted-foreground">
                        Manage your blog tags and view usage statistics.
                    </p>
                </div>
                <Link href="/admin/tags/new">
                    <Button className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Create Tag
                    </Button>
                </Link>
            </div>

            <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                <CardHeader className="p-6 pb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle>All Tags</CardTitle>
                            <Badge variant="secondary" className="font-normal">{filteredTags.length}</Badge>
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search tags..."
                                className="pl-8 bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead className="text-right">Usage Count</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                <span>Loading tags...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredTags.length > 0 ? (
                                    filteredTags.map((tag) => (
                                        <TableRow key={tag.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                                                        <Tag className="h-4 w-4" />
                                                    </div>
                                                    {tag.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                <Badge variant="outline" className="font-normal text-muted-foreground">
                                                    {tag.slug}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-medium">{tag.count} posts</span>
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
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/tags/${tag.id}/edit`} className="cursor-pointer flex items-center w-full">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                            onClick={() => handleDelete(tag.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No tags found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
