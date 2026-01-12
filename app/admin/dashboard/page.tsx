import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Eye, Edit3, AlertCircle } from "lucide-react"
import { getDashboardStats } from "./actions"

export default async function DashboardPage() {
    const result = await getDashboardStats()

    if (!result.success) {
        return (
            <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive opacity-50" />
                <div className="space-y-1">
                    <h3 className="text-xl font-bold">Failed to load dashboard</h3>
                    <p className="text-muted-foreground">{result.message}</p>
                </div>
            </div>
        )
    }

    const { totalPosts, publishedPosts, draftPosts, totalViews, recentPosts } = result.data!

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-6">
                        <CardTitle className="text-sm font-medium">
                            Total Posts
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-2xl font-bold">{totalPosts}</div>
                        <p className="text-xs text-muted-foreground">
                            In your database
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-6">
                        <CardTitle className="text-sm font-medium">
                            Published
                        </CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-2xl font-bold">{publishedPosts}</div>
                        <p className="text-xs text-muted-foreground">
                            Live on site
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-6">
                        <CardTitle className="text-sm font-medium">
                            Drafts
                        </CardTitle>
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-2xl font-bold">{draftPosts}</div>
                        <p className="text-xs text-muted-foreground">
                            Waiting to be published
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-6">
                        <CardTitle className="text-sm font-medium">
                            Total Views
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            All-time engagement
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Posts Table */}
            <div className="grid gap-4 grid-cols-1">
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0">
                    <CardHeader className="p-6 pb-6">
                        <CardTitle>Recent Posts</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Views</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPosts.length > 0 ? (
                                    recentPosts.map((post: any) => (
                                        <TableRow key={post.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium max-w-[300px] truncate">{post.title}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={post.status === "published" ? "default" : "secondary"}
                                                    className={post.status === "published" ? "bg-green-500 hover:bg-green-600 capitalize" : "capitalize"}
                                                >
                                                    {post.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                                            <TableCell className="text-right font-semibold">{post.view_count || 0}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No posts found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
