import { configureSync, getConsoleSink } from "@logtape/logtape"

configureSync({
  sinks: {
    console: getConsoleSink(),
  },
  loggers: [
    {
      category: ["saas"],
      lowestLevel: "debug",
      sinks: ["console"],
    },
  ],
})
