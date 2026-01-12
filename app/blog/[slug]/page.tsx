import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Share2, Facebook, Twitter, Linkedin, Heart, MessageCircle } from "lucide-react"
import { getPostBySlug, getPosts } from "../../admin/posts/actions"
import { getComments } from "../comment-actions"
import { CommentForm } from "@/components/blog/comment-form"
import { CommentList } from "@/components/blog/comment-list"
import { ViewCounter } from "@/components/blog/view-counter"
import { WishlistButton } from "@/components/blog/wishlist-button"
import { ShareButtons } from "@/components/blog/share-buttons"

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    const { data: posts } = await getPosts({ status: 'published' })
    return posts?.map((post: any) => ({
        slug: post.slug,
    })) || []
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params // Await params for Next.js 16
    const { data: post, success } = await getPostBySlug(slug)

    if (!success || !post) {
        notFound()
    }

    const { data: comments } = await getComments(post.id)

    return (
        <div className="container py-12 md:py-16 px-4 md:px-6 max-w-4xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-8">
                <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
                    <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Blog
                </Link>
            </div>

            <article className="space-y-8 md:space-y-12">
                {/* Header Section */}
                <div className="space-y-8 text-center max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up">
                        {post.categories && post.categories.length > 0 ? (
                            post.categories.map((c: any) => (
                                <Badge key={c.category.id} variant="secondary" className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary border-none">
                                    {c.category?.name}
                                </Badge>
                            ))
                        ) : (
                            <Badge variant="secondary" className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary border-none">
                                Uncategorized
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl text-foreground leading-[1.1] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                                <AvatarImage src={post.author?.avatar_url} alt={post.author?.full_name} />
                                <AvatarFallback>{post.author?.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-left">
                                <span className="text-lg font-bold text-foreground">{post.author?.full_name}</span>
                                <span className="text-sm text-muted-foreground font-medium">{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="aspect-[21/9] w-full relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border/50 animate-fade-in-up scale-100 hover:scale-[1.01] transition-transform duration-500" style={{ animationDelay: "0.3s" }}>
                    <img
                        src={post.featured_image_url || "/placeholder-post.jpg"}
                        alt={post.title}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Gallery Image (New) */}
                {post.gallery_image_url && (
                    <div className="grid grid-cols-1 gap-8 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
                        <div className="group relative aspect-[16/6] w-full overflow-hidden rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10" />
                            <img
                                src={post.gallery_image_url}
                                alt="Gallery perspective"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-4 left-6 z-20">
                                <Badge variant="secondary" className="bg-white/90 text-black hover:bg-white border-none backdrop-blur-sm px-4 py-1.5 font-bold shadow-lg">
                                    POST GALLERY
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Body */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16">
                    <div className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed 
                        prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                        prose-p:leading-loose prose-strong:text-foreground prose-strong:font-bold
                        prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:rounded-xl prose-blockquote:px-8 prose-blockquote:py-2
                        prose-img:rounded-2xl prose-img:shadow-lg">

                        {post.excerpt && (
                            <p className="text-2xl text-foreground font-medium leading-relaxed mb-12 first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                                {post.excerpt}
                            </p>
                        )}

                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Sidebar / Actions */}
                    <aside className="hidden md:flex flex-col gap-6 sticky top-24 h-fit">
                        <div className="flex flex-col gap-4 items-center p-4 bg-muted/30 rounded-full border">
                            <WishlistButton postId={post.id} />

                            <Link href="#comments" className="flex flex-col items-center gap-1 group">
                                <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 shadow-sm hover:shadow-md" title="Jump to Comments">
                                    <MessageCircle className="h-6 w-6" />
                                </Button>
                                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                    {comments?.length || 0}
                                </span>
                            </Link>
                        </div>

                        <ShareButtons title={post.title} slug={post.slug} />
                    </aside>
                </div>

                {/* Mobile Share Actions */}
                <div className="flex md:hidden items-center justify-between p-4 bg-muted/30 rounded-xl border mt-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Heart className="h-4 w-4" /> 0
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <MessageCircle className="h-4 w-4" /> {comments?.length || 0}
                        </Button>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 rounded-full">
                        <Share2 className="h-4 w-4" /> Share
                    </Button>
                </div>

                {/* Tags Footer */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-semibold mr-2">Tags:</span>
                        {post.tags.map((tag: any) => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1 hover:bg-secondary/80 cursor-pointer">#{tag}</Badge>
                        ))}
                    </div>
                )}

                {/* Comments Section */}
                {post.allow_comments && (
                    <div className="mt-16 space-y-12">
                        <CommentList comments={comments || []} />
                        <CommentForm postId={post.id} />
                    </div>
                )}
            </article>
            {/* View Counter */}
            <ViewCounter postId={post.id} />
        </div>
    )
}
