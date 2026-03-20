import { TrendingDown, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2,420
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Registered users across all plans
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Subscriptions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,182
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong retention <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Paid plans currently active
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Recurring Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $24,580
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +18.7%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue growing steadily <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            MRR from all active subscriptions
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Error Rate (24h)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0.12%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDown />
              -2.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Stable system health <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            API errors in the last 24 hours
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
