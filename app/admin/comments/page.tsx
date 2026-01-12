"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import {
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Trash2,
    AlertOctagon,
    Search,
    Filter,
    RotateCcw
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { getAllComments, updateCommentStatus, deleteCommentPermanently } from "@/app/blog/comment-actions"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

export default function CommentsPage() {
    const [comments, setComments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    useEffect(() => {
        loadComments()
    }, [])

    async function loadComments() {
        setIsLoading(true)
        const result = await getAllComments()
        if (result.success) {
            setComments(result.data || [])
        } else {
            toast.error(result.message)
        }
        setIsLoading(false)
    }

    const filteredComments = useMemo(() => {
        return comments.filter((comment) => {
            const matchesSearch =
                comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.post?.title.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesTab =
                activeTab === "all" ||
                comment.status.toLowerCase() === activeTab.toLowerCase()

            return matchesSearch && matchesTab
        })
    }, [comments, searchTerm, activeTab])

    const counts = useMemo(() => {
        return {
            all: comments.length,
            pending: comments.filter(c => c.status === "pending").length,
            approved: comments.filter(c => c.status === "approved").length,
            spam: comments.filter(c => c.status === "spam").length,
            trash: comments.filter(c => c.status === "trash").length,
        }
    }, [comments])

    async function handleStatusUpdate(id: string, status: 'approved' | 'pending' | 'spam' | 'trash') {
        const result = await updateCommentStatus(id, status)
        if (result.success) {
            toast.success(result.message)
            loadComments()
        } else {
            toast.error(result.message)
        }
    }

    async function handleDeletePermanently(id: string) {
        if (!confirm("Are you sure you want to delete this comment permanently?")) return
        const result = await deleteCommentPermanently(id)
        if (result.success) {
            toast.success(result.message)
            loadComments()
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Comments</h2>
                    <p className="text-muted-foreground">
                        Manage and moderate user comments.
                    </p>
                </div>
            </div>

            <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <CardHeader className="p-6 pb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <CardTitle>All Comments</CardTitle>
                                <Badge variant="secondary" className="font-normal">{filteredComments.length}</Badge>
                            </div>
                            <div className="flex w-full md:w-auto items-center gap-2">
                                <div className="relative w-full md:w-[300px]">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search comments..."
                                        className="pl-8 bg-background"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <TabsList className="h-auto p-0 bg-transparent gap-2">
                            <TabsTrigger
                                value="all"
                                className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                            >
                                All
                                {counts.all > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/20 text-primary border-none">{counts.all}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger
                                value="pending"
                                className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                            >
                                Pending
                                {counts.pending > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/20 text-primary border-none">{counts.pending}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger
                                value="approved"
                                className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                            >
                                Approved
                                {counts.approved > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/20 text-primary border-none">{counts.approved}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger
                                value="spam"
                                className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                            >
                                Spam
                                {counts.spam > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/20 text-primary border-none">{counts.spam}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger
                                value="trash"
                                className="h-8 px-4 rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                            >
                                Trash
                                {counts.trash > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/20 text-primary border-none">{counts.trash}</Badge>}
                            </TabsTrigger>
                        </TabsList>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">Author</TableHead>
                                        <TableHead className="min-w-[300px]">Comment</TableHead>
                                        <TableHead className="w-[200px]">In Response To</TableHead>
                                        <TableHead className="w-[150px]">Date</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">Loading comments...</TableCell>
                                        </TableRow>
                                    ) : filteredComments.length > 0 ? (
                                        filteredComments.map((comment) => (
                                            <TableRow key={comment.id} className="group">
                                                <TableCell className="align-top">
                                                    <div className="flex gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.name}`} alt={comment.name} />
                                                            <AvatarFallback>{comment.name[0].toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="grid gap-0.5">
                                                            <div className="font-medium text-sm">{comment.name}</div>
                                                            <div className="text-xs text-muted-foreground line-clamp-1">{comment.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="space-y-2">
                                                        {comment.status === "pending" && (
                                                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                                                                Pending Review
                                                            </Badge>
                                                        )}
                                                        {comment.status === "spam" && (
                                                            <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                                                Spam
                                                            </Badge>
                                                        )}
                                                        <p className="text-sm leading-relaxed text-foreground/90">
                                                            {comment.content}
                                                        </p>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2 pt-1">
                                                            {comment.status !== "approved" && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                    onClick={() => handleStatusUpdate(comment.id, 'approved')}
                                                                >
                                                                    <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                                                    Approve
                                                                </Button>
                                                            )}
                                                            {comment.status === "approved" && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                                                    onClick={() => handleStatusUpdate(comment.id, 'pending')}
                                                                >
                                                                    <XCircle className="mr-1 h-3.5 w-3.5" />
                                                                    Unapprove
                                                                </Button>
                                                            )}
                                                            {comment.status !== "spam" && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                                    onClick={() => handleStatusUpdate(comment.id, 'spam')}
                                                                >
                                                                    <AlertOctagon className="mr-1 h-3.5 w-3.5" />
                                                                    Spam
                                                                </Button>
                                                            )}
                                                            {comment.status !== "trash" && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    onClick={() => handleStatusUpdate(comment.id, 'trash')}
                                                                >
                                                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                                                                    Trash
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    {comment.post ? (
                                                        <Badge variant="outline" className="font-normal line-clamp-2">
                                                            {comment.post.title}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">Post deleted</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="align-top text-sm text-muted-foreground">
                                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                                </TableCell>
                                                <TableCell className="align-top text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {comment.status === "trash" ? (
                                                                <>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(comment.id, 'pending')}>
                                                                        <RotateCcw className="mr-2 h-4 w-4" />
                                                                        Restore
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePermanently(comment.id)}>
                                                                        Delete Permanently
                                                                    </DropdownMenuItem>
                                                                </>
                                                            ) : (
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(comment.id, 'trash')}>
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Move to Trash
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                No comments found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Tabs>
            </Card>
        </div>
    )
}
