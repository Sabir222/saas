import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Analytics</CardTitle>
          </div>
          <CardDescription>
            Signups, MRR, churn rate, and plan distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Analytics dashboard coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
