import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
    return (
        <section className="relative overflow-hidden py-24 lg:py-32">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative flex flex-col items-center text-center space-y-8">
                {/* Pill Badge */}
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-background/50 backdrop-blur-sm text-sm font-medium hover:bg-muted transition-colors cursor-default">
                    <Sparkles className="h-3.5 w-3.5 mr-2 text-primary fill-primary/20" />
                    <span className="text-muted-foreground/80">
                        Fresh perspectives on <span className="text-foreground font-semibold">Technology</span>
                    </span>
                </Badge>

                {/* Main Heading */}
                <div className="space-y-4 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 drop-shadow-sm">
                        Explore Ideas <br className="hidden sm:block" />
                        <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-primary/60">That Matter.</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl/relaxed leading-relaxed font-light">
                        Discover insightful stories, in-depth tutorials, and the latest trends in technology and design.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <Link href="/blog">
                        <Button size="lg" className="h-12 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all w-full sm:w-auto group">
                            Start Reading
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Stats or Social Proof (Optional) */}
                <div className="pt-8 flex items-center justify-center gap-8 text-muted-foreground/50 grayscale opacity-70 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium tracking-wide uppercase">v2.0.0 Live</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
