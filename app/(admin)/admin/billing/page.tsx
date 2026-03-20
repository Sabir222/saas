import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CreditCard } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Billing & Plans</CardTitle>
          </div>
          <CardDescription>
            Manage subscriptions, invoices, and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Billing management coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
