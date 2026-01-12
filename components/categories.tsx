import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tags } from "lucide-react"

interface CategoriesProps {
    initialCategories: any[]
}

export function Categories({ initialCategories }: CategoriesProps) {
    if (!initialCategories || initialCategories.length === 0) return null

    return (
        <section className="py-12 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Popular Topics</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {initialCategories.slice(0, 8).map((category) => (
                        <Link key={category.id} href={`/blog?category=${encodeURIComponent(category.name)}`}>
                            <Button variant="outline" className="h-auto py-3 px-6 flex flex-col items-center gap-2 hover:border-primary hover:text-primary transition-colors min-w-[120px]">
                                {category.icon_url ? (
                                    <div className="h-8 w-8 rounded-full overflow-hidden">
                                        <img src={category.icon_url} alt={category.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <Tags className="h-6 w-6 opacity-40" />
                                )}
                                <span className="font-medium">{category.name}</span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
