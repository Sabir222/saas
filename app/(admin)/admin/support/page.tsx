import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LifeBuoy } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Support Tools</CardTitle>
          </div>
          <CardDescription>
            User lookup, internal notes, and communication log
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Support tools coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
