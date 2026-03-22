import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Flag } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Feature Flags</CardTitle>
          </div>
          <CardDescription>
            Enable features per user, per plan, or percentage rollout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Feature flag management coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
