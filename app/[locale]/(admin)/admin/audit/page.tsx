import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollText } from "lucide-react"

export default function AuditPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Audit Log</CardTitle>
          </div>
          <CardDescription>
            Timestamped action trail — who did what and when
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Audit log viewer coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
