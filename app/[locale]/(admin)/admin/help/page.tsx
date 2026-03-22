import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export default function AdminHelpPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Help & Documentation</CardTitle>
          </div>
          <CardDescription>
            Guides and documentation for the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Help documentation coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
