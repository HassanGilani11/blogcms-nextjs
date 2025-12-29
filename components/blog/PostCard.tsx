import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PostCardProps = {
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
  category?: {
    name: string;
    slug: string;
  };
  readingTime?: number;
};

export function PostCard({
  title,
  slug,
  excerpt,
  featuredImage,
  publishedAt,
  category,
  readingTime,
}: PostCardProps) {
  return (
    <Card className="overflow-hidden">
      {featuredImage && (
        <div className="relative h-48 w-full">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        {category && (
          <Badge variant="secondary" className="w-fit">
            {category.name}
          </Badge>
        )}
        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-semibold hover:underline">{title}</h3>
        </Link>
      </CardHeader>
      {excerpt && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
      )}
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        {publishedAt && <span>{new Date(publishedAt).toLocaleDateString()}</span>}
        {readingTime && <span>{readingTime} min read</span>}
      </CardFooter>
    </Card>
  );
}

