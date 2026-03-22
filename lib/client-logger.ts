"use client"

const isDev = process.env.NODE_ENV === "development"

type LogData = Record<string, unknown> | undefined

function format(message: string) {
  return `[saas] ${message}`
}

export const clientLogger = {
  debug: (message: string, data?: LogData) => {
    if (isDev) {
      console.debug(format(message), data)
    }
  },

  info: (message: string, data?: LogData) => {
    if (isDev) {
      console.info(format(message), data)
    }
  },

  warn: (message: string, data?: LogData) => {
    console.warn(format(message), data)
  },

  error: (message: string, data?: LogData) => {
    console.error(format(message), data)
  },
}
