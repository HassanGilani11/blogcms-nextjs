import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface CommentListProps {
    comments: any[]
}

export function CommentList({ comments }: CommentListProps) {
    if (comments.length === 0) {
        return null
    }

    return (
        <div className="space-y-8 mt-12">
            <h3 className="text-2xl font-bold tracking-tight mb-8">
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
            <div className="space-y-10">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-1 ring-border/50">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.name}`} alt={comment.name} />
                            <AvatarFallback>{comment.name[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground text-lg">{comment.name}</span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="bg-muted/30 rounded-2xl p-6 text-muted-foreground leading-relaxed border border-border/50 shadow-sm">
                                {comment.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
