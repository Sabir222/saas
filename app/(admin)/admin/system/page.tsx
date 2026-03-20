import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Activity } from "lucide-react"

export default function SystemPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <CardTitle>System Health</CardTitle>
          </div>
          <CardDescription>
            Error rate, slow queries, queue depth, and uptime
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            System health monitoring coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
