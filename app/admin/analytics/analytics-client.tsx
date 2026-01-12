"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select as UISelect,
    SelectContent as UISelectContent,
    SelectItem as UISelectItem,
    SelectTrigger as UISelectTrigger,
    SelectValue as UISelectValue,
} from "@/components/ui/select"
import {
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    MousePointer2,
    Clock,
    FileText,
    MessageSquare,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    User,
} from "lucide-react"

// SVG Line Chart Component
const SimpleLineChart = ({ data, color = "#3b82f6" }: { data: number[], color?: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 300;
    const height = 100;
    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / range) * height
    }));

    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;

    return (
        <div className="w-full h-[120px] relative mt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaData} fill="url(#gradient)" />
                <path d={pathData} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                {/* Dots */}
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke={color} strokeWidth="1.5" className="hover:r-[5px] transition-all cursor-pointer" />
                ))}
            </svg>
        </div>
    );
};

interface AnalyticsClientProps {
    data: {
        categoriesShare: any[]
        totalComments: number
        topContent: any[]
        totalPosts: number
        totalViews: number
    }
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
    const { categoriesShare, totalComments, topContent, totalPosts, totalViews } = data

    // Logic for colors based on index for categories
    const categoryColors = [
        "bg-primary",
        "bg-purple-500",
        "bg-orange-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-pink-500"
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
                    <p className="text-muted-foreground">Deep dive into your site's performance and audience engagement.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">Timeframe:</span>
                    <UISelect defaultValue="30d">
                        <UISelectTrigger className="w-[180px] bg-background">
                            <UISelectValue placeholder="Select period" />
                        </UISelectTrigger>
                        <UISelectContent>
                            <UISelectItem value="7d">Last 7 Days</UISelectItem>
                            <UISelectItem value="30d">Last 30 Days</UISelectItem>
                            <UISelectItem value="90d">Last 90 Days</UISelectItem>
                            <UISelectItem value="12m">Last 12 Months</UISelectItem>
                            <UISelectItem value="all">All Time</UISelectItem>
                        </UISelectContent>
                    </UISelect>
                </div>
            </div>

            {/* Primary Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0 bg-gradient-to-br from-background to-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-6">
                        <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                        <Eye className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-bold tracking-tight">{totalViews.toLocaleString()}</div>
                        <p className="text-xs text-green-500 font-bold flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" /> Live
                            <span className="text-muted-foreground font-normal ml-1">cumulative views</span>
                        </p>
                        <SimpleLineChart data={[12, 18, 15, 25, 22, 35, 30, 48]} color="#3b82f6" />
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-gradient-to-br from-background to-purple-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-bold tracking-tight">{totalPosts}</div>
                        <p className="text-xs text-green-500 font-bold flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" /> Active
                            <span className="text-muted-foreground font-normal ml-1">content items</span>
                        </p>
                        <SimpleLineChart data={[8, 10, 9, 14, 12, 16, 15, 12]} color="#a855f7" />
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-gradient-to-br from-background to-orange-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                        <MessageSquare className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-bold tracking-tight">{totalComments}</div>
                        <p className="text-xs text-green-500 font-bold flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" /> Engagement
                            <span className="text-muted-foreground font-normal ml-1">user discussions</span>
                        </p>
                        <SimpleLineChart data={[20, 22, 28, 25, 24, 21, 23, 20]} color="#f97316" />
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-gradient-to-br from-background to-green-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-bold tracking-tight">42.8%</div>
                        <p className="text-xs text-green-500 font-bold flex items-center mt-1">
                            <ArrowDownRight className="h-3 w-3 mr-0.5" /> -8.1%
                            <span className="text-muted-foreground font-normal ml-1">from last month</span>
                        </p>
                        <SimpleLineChart data={[50, 48, 49, 45, 46, 43, 44, 42]} color="#22c55e" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Popular Content Breakdown */}
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardHeader className="p-6 pb-6">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" /> Top Performing Content
                        </CardTitle>
                        <CardDescription>Most viewed blog posts in the current period.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-5">
                        {topContent.length > 0 ? topContent.map((post, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="space-y-1 max-w-[70%]">
                                    <p className="text-sm font-bold truncate group-hover:text-primary transition-colors cursor-pointer">{post.title}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black">
                                        <span>{post.category?.name || "Uncategorized"}</span>
                                        <span>•</span>
                                        <span>Published</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black">{post.views?.toLocaleString() || 0} Views</div>
                                    <div className={`text-[10px] font-bold text-green-500`}>
                                        Trending
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No published content yet.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Team Performance - Keep as dummy or simplify */}
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardHeader className="p-6 pb-6">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" /> Top Contributors
                        </CardTitle>
                        <CardDescription>Performance breakdown by author.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-6">
                        {[
                            { name: "Hassan Gilani", role: "Super Admin", posts: totalPosts, reach: `${(totalViews / 1000).toFixed(1)}k`, progress: 100 },
                        ].map((author, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                                            {author.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{author.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black">{author.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black">{author.posts} Posts</p>
                                        <p className="text-[10px] text-muted-foreground">{author.reach} Reach</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 ease-in-out"
                                        style={{ width: `${author.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Content Growth */}
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0 h-full">
                    <CardHeader className="p-6 pb-6">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" /> Growth Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex flex-col justify-between h-[180px]">
                        <div className="space-y-1">
                            <div className="text-2xl font-black">+{totalPosts}</div>
                            <p className="text-xs text-muted-foreground">Total content items</p>
                        </div>
                        <SimpleLineChart data={[10, 25, 15, 40, 30, 60, 50, 85]} color="#3b82f6" />
                    </CardContent>
                </Card>

                {/* Categories Share - NOW DYNAMIC */}
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0 h-full">
                    <CardHeader className="p-6 pb-6">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" /> Categories Share
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        {categoriesShare.length > 0 ? categoriesShare.map((cat, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="flex items-center gap-2 uppercase tracking-tighter">
                                        <span className={`h-2 w-2 rounded-full ${categoryColors[i % categoryColors.length] || 'bg-muted'}`} /> {cat.name}
                                    </span>
                                    <span>{cat.share}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${categoryColors[i % categoryColors.length] || 'bg-muted'}`}
                                        style={{ width: `${cat.share}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-muted-foreground text-center py-4">No categories data.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Engagement */}
                <Card className="shadow-sm border-none ring-1 ring-border/50 gap-0 h-full">
                    <CardHeader className="p-6 pb-6">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" /> Interaction
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/30 rounded-lg border flex flex-col items-center justify-center gap-1 text-center">
                                <div className="text-lg font-black underline decoration-primary/50 decoration-2">{totalComments}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-black">Comments</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border flex flex-col items-center justify-center gap-1 text-center">
                                <div className="text-lg font-black underline decoration-purple-500/50 decoration-2">0</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-black">Reactions</div>
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest text-center">Recent Interactions</p>
                            <div className="flex -space-x-3 justify-center">
                                <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary ring-1 ring-primary/20">
                                    +{totalComments}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
