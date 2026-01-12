import { getAnalyticsData, getDashboardStats } from "../dashboard/actions"
import { AnalyticsClient } from "./analytics-client"
import { AlertCircle } from "lucide-react"

export default async function AnalyticsPage() {
    const [analyticsResult, dashboardResult] = await Promise.all([
        getAnalyticsData(),
        getDashboardStats()
    ])

    if (!analyticsResult.success || !dashboardResult.success) {
        return (
            <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive opacity-50" />
                <div className="space-y-1">
                    <h3 className="text-xl font-bold">Failed to load analytics</h3>
                    <p className="text-muted-foreground">
                        {analyticsResult.message || dashboardResult.message}
                    </p>
                </div>
            </div>
        )
    }

    const { categoriesShare, totalComments, topContent } = analyticsResult.data!
    const { totalPosts, totalViews } = dashboardResult.data!

    const combinedData = {
        categoriesShare,
        totalComments,
        topContent,
        totalPosts,
        totalViews
    }

    return <AnalyticsClient data={combinedData} />
}
