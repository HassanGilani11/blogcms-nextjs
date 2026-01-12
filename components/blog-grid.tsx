import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
export function BlogGrid({ posts }: { posts: any[] }) {
    // Force cache invalidation
    const displayedPosts = posts.slice(0, 6)

    return (
        <section className="py-16 md:py-24 bg-gradient-to-t from-muted/30 to-background">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-sm font-medium">
                        Latest Updates
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Recent Articles</h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                        Explore our latest thoughts on technology, design, and everything in between.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {displayedPosts.map((post) => (
                        <Card key={post.id} className="group flex flex-col h-full border-0 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden ring-1 ring-border/50 p-0">
                            <Link href={`/blog/${post.slug}`} className="block">
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
                            </Link>

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

                <div className="flex justify-center mt-16">
                    <Link
                        href="/blog"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 text-base font-medium shadow-sm transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2 group"
                    >
                        View All Articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
