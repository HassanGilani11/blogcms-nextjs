"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, SlidersHorizontal, Calendar } from "lucide-react"

const ITEMS_PER_PAGE = 6

export function BlogContent({ initialPosts, allCategories }: { initialPosts: any[], allCategories: any[] }) {
    const searchParams = useSearchParams()
    const categoryParam = searchParams.get("category")

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [currentPage, setCurrentPage] = useState(1)

    // Sync state with URL parameter
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam)
        } else {
            setSelectedCategory("All")
        }
    }, [categoryParam])

    // Get unique categories from dynamic database entries
    const categories = useMemo(() => {
        const names = allCategories.map(c => c.name)
        return ["All", ...names]
    }, [allCategories])

    // Filter posts
    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesCategory = selectedCategory === "All" ||
                post.categories?.some((c: any) => c.category?.name === selectedCategory)
            return matchesSearch && matchesCategory
        })
    }, [initialPosts, searchQuery, selectedCategory])

    // Pagination logic
    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-7xl mx-auto py-16 md:py-24 px-4 md:px-6">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-6 mb-16">
                    <Badge variant="outline" className="px-4 py-1.5 text-sm rounded-full border-primary/20 bg-primary/5 text-primary">
                        Blog & Resources
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Explore Our Stories
                    </h1>
                    <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl/relaxed">
                        Expert insights, tutorials, and trends from the world of modern web development.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="max-w-3xl mx-auto mb-20">
                    <div className="relative group rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-background border p-2 flex items-center gap-2">
                        <div className="pl-4 text-muted-foreground">
                            <Search className="h-5 w-5" />
                        </div>
                        <Input
                            type="search"
                            placeholder="Search for articles..."
                            className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-12 text-base px-2 flex-1"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                        <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block"></div>
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => {
                                setSelectedCategory(value)
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[140px] sm:w-[180px] border-0 shadow-none focus:ring-0 bg-transparent h-12 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Category" />
                                </div>
                            </SelectTrigger>
                            <SelectContent align="end" className="w-[200px]">
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category} className="cursor-pointer">
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Blog Grid */}
                {paginatedPosts.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-20">
                        {paginatedPosts.map((post) => (
                            <Card key={post.id} className="group flex flex-col h-full border-0 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden ring-1 ring-border/50 p-0">
                                <div className="aspect-[1.6/1] w-full bg-muted relative overflow-hidden m-0 p-0">
                                    <img
                                        src={post.featured_image_url || "/placeholder-post.jpg"}
                                        alt={post.title}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        {post.categories && post.categories.length > 0 ? (
                                            post.categories.map((c: any) => (
                                                <Badge key={c.category.id} className="bg-background/90 text-foreground hover:bg-background backdrop-blur-md shadow-sm border-0 font-medium px-3 py-1">
                                                    {c.category?.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <Badge className="bg-background/90 text-foreground hover:bg-background backdrop-blur-md shadow-sm border-0 font-medium px-3 py-1">
                                                Uncategorized
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <CardHeader className="p-6 pb-2 space-y-3">
                                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                                        <Link href={`/blog/${post.slug}`} className="block">
                                            {post.title}
                                        </Link>
                                    </h3>
                                </CardHeader>

                                <CardContent className="p-6 pt-2 flex-1">
                                    <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm">
                                        {post.excerpt}
                                    </p>
                                </CardContent>

                                <CardFooter className="p-6 pt-0 mt-auto">
                                    <div className="flex items-center gap-3 w-full pt-4 border-t border-border/50">
                                        <Avatar className="h-9 w-9 border ring-2 ring-background transition-transform group-hover:scale-110">
                                            <AvatarImage src={post.author?.avatar_url} alt={post.author?.full_name} />
                                            <AvatarFallback>{post.author?.full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{post.author?.full_name}</span>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6 animate-pulse">
                            <Search className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">No articles found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            We couldn't find matches for "{searchQuery}" in {selectedCategory}. Try adjusting your keywords.
                        </p>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("")
                                setSelectedCategory("All")
                            }}
                            className="rounded-full px-8"
                        >
                            Reset All Filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination className="bg-background/80 backdrop-blur-sm shadow-sm border rounded-full px-4 py-2 inline-flex w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) handlePageChange(currentPage - 1);
                                        }}
                                        aria-disabled={currentPage === 1}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-accent hover:text-accent-foreground rounded-full"}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === i + 1}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(i + 1);
                                            }}
                                            className={`rounded-full ${currentPage === i + 1 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent hover:text-accent-foreground"}`}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                        }}
                                        aria-disabled={currentPage === totalPages}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent hover:text-accent-foreground rounded-full"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    )
}
