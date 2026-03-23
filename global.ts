import { routing } from "@/lib/routing"
import messages from "./messages/en.json"

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
