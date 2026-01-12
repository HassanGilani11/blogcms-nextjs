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
import { MoreHorizontal, Edit, Trash2, Plus, Tags, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getCategories, deleteCategory } from "./actions"
import { toast } from "sonner"

export default function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    async function fetchCategories() {
        setIsLoading(true)
        const result = await getCategories()
        if (result.success) {
            setCategories(result.data)
        } else {
            toast.error(result.message || "Failed to fetch categories")
        }
        setIsLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this category?")) return

        const result = await deleteCategory(id)
        if (result.success) {
            toast.success(result.message)
            fetchCategories()
        } else {
            toast.error(result.message || "Failed to delete category")
        }
    }

    const filteredCategories = useMemo(() => {
        return categories.filter((category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [searchTerm, categories])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">
                        Manage your blog categories.
                    </p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Create Category
                    </Button>
                </Link>
            </div>

            <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                <CardHeader className="p-6 pb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle>All Categories</CardTitle>
                            <Badge variant="secondary" className="font-normal">{filteredCategories.length}</Badge>
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search categories..."
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
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Count</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                <span>Loading categories...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredCategories.length > 0 ? (
                                    filteredCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                                                        <Tags className="h-4 w-4" />
                                                    </div>
                                                    {category.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                            <TableCell className="text-muted-foreground max-w-[300px] truncate">
                                                {category.description || "No description"}
                                            </TableCell>
                                            <TableCell className="text-right">{category.count}</TableCell>
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
                                                            <Link href={`/blog?category=${encodeURIComponent(category.name)}`} target="_blank" className="cursor-pointer flex items-center w-full">
                                                                <Search className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/categories/${category.id}/edit`} className="cursor-pointer flex items-center w-full">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                            onClick={() => handleDelete(category.id)}
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
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No categories found.
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
