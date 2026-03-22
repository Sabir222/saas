import { configureSync, getConsoleSink, getLogger } from "@logtape/logtape"

configureSync({
  sinks: {
    console: getConsoleSink(),
  },
  loggers: [
    {
      category: ["logtape", "meta"],
      lowestLevel: "warning",
    },
    {
      category: ["saas"],
      lowestLevel: "debug",
      sinks: ["console"],
    },
  ],
})

export const logger = getLogger(["saas"])
