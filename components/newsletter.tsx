import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
    return (
        <section className="py-16 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 items-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
                            Subscribe to our newsletter
                        </h2>
                        <p className="text-primary-foreground/80 md:text-lg">
                            Get the latest updates, articles, and resources sent directly to your inbox.
                        </p>
                    </div>
                    <div className="flex w-full max-w-sm items-center space-x-2 lg:justify-self-end">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/30"
                        />
                        <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
