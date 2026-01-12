import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Calendar } from "lucide-react"
export function FeaturedPosts({ posts }: { posts: any[] }) {
    // Select specific posts for featured section
    const featuredPost = posts.find(p => p.featured) || posts[0]

    if (!featuredPost) return null

    const sidePosts = posts.filter(p => p.id !== featuredPost.id).slice(0, 3)

    return (
        <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-end justify-between mb-8">
                    <div className="space-y-4">
                        <Badge variant="outline" className="px-3 py-1 text-sm rounded-full border-primary/20 bg-primary/5 text-primary w-fit">
                            Must Read
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Featured Stories</h2>
                    </div>
                    <Link href="/blog" className="hidden md:flex text-sm font-medium text-muted-foreground hover:text-primary transition-colors items-center gap-2 group">
                        View all articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Revised Grid: Reduced gap and balanced columns */}
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-start">
                    {/* Main Featured Post */}
                    <Link href={`/blog/${featuredPost.slug}`} className="block group h-full">
                        <Card className="flex flex-col h-full border-0 shadow-none bg-transparent overflow-hidden ring-0">
                            <div className="aspect-[16/10] w-full relative rounded-2xl overflow-hidden mb-5">
                                <img
                                    src={featuredPost.featured_image_url || "/placeholder-post.jpg"}
                                    alt={featuredPost.title}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                    {featuredPost.categories && featuredPost.categories.length > 0 ? (
                                        featuredPost.categories.map((c: any) => (
                                            <Badge key={c.category.id} className="bg-background/90 text-foreground hover:bg-background backdrop-blur-md shadow-sm border-0 font-medium px-3 py-1 text-base">
                                                {c.category?.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Badge className="bg-background/90 text-foreground hover:bg-background backdrop-blur-md shadow-sm border-0 font-medium px-3 py-1 text-base">
                                            Uncategorized
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <h3 className="text-3xl md:text-3xl lg:text-4xl font-bold leading-tight group-hover:text-primary transition-colors">
                                    {featuredPost.title}
                                </h3>
                                <p className="text-lg text-muted-foreground line-clamp-3 leading-relaxed hidden sm:block">
                                    {featuredPost.excerpt}
                                </p>
                            </div>
                        </Card>
                    </Link>

                    {/* Side Posts - Enhanced UI for "Even" look */}
                    <div className="flex flex-col gap-4 h-full">
                        {sidePosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/40">
                                <div className="h-24 w-24 md:h-28 md:w-28 shrink-0 rounded-xl bg-muted overflow-hidden relative shadow-sm">
                                    <img
                                        src={post.featured_image_url || "/placeholder-post.jpg"}
                                        alt={post.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="space-y-1.5 flex-1 py-1">
                                    <div className="flex flex-wrap gap-1 text-xs font-medium text-primary">
                                        {post.categories && post.categories.length > 0 ? (
                                            post.categories.map((c: any) => (
                                                <Badge key={c.category.id} variant="secondary" className="px-1.5 py-0 h-5 text-[10px]">
                                                    {c.category?.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px]">
                                                Uncategorized
                                            </Badge>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-1 hidden md:block opacity-80">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-8 md:hidden">
                    <Link href="/blog" className="flex items-center justify-center gap-2 text-sm font-medium w-full py-3 border rounded-full hover:bg-muted transition-colors">
                        View all articles <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
