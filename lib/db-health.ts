import { Client } from "pg"

import { env } from "@/lib/Env"
import { logger } from "@/lib/logger"

export type DbHealthResult = {
  ok: boolean
  message: string
  code?: string
  suggestion?: string
}

export async function checkDbHealth(
  props: {
    timeoutMs?: number
    url?: string
  } = {}
): Promise<DbHealthResult> {
  const timeoutMs = props.timeoutMs ?? 3000
  const url = props.url ?? env.POSTGRES_URL

  const client = new Client({
    connectionString: url,
    connectionTimeoutMillis: timeoutMs,
  })

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("connect_timeout")), timeoutMs)
  })

  try {
    await Promise.race([client.connect(), timeout])
    await client.query("SELECT 1")
    await client.end()

    return {
      ok: true,
      message: "Connected to Postgres",
    }
  } catch (error) {
    const reason = getErrorMessage(error)
    const code = getErrorCode(error)

    logger.error("Database health check failed", {
      code,
      message: reason,
      suggestion: getDbRecoverySuggestion(reason, code),
    })

    try {
      await client.end()
    } catch {
      logger.debug("Failed to close database client after health check error")
    }

    return {
      ok: false,
      code,
      message: reason,
      suggestion: getDbRecoverySuggestion(reason, code),
    }
  }
}

function getErrorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = error.code

    if (typeof code === "string") {
      return code
    }
  }

  return undefined
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function getDbRecoverySuggestion(message: string, code?: string) {
  if (code === "ECONNREFUSED" || message.includes("ECONNREFUSED")) {
    return "Run `docker compose up -d postgres` to start the local database."
  }

  if (code === "ENOTFOUND" || message.includes("getaddrinfo")) {
    return "Check `POSTGRES_URL` in `.env` and then run `docker compose up -d postgres`."
  }

  if (message === "connect_timeout" || /timeout/i.test(message)) {
    return "Postgres did not respond in time. Run `docker compose up -d postgres`."
  }

  if (code === "28P01" || /password|authentication/i.test(message)) {
    return "Check your Postgres credentials in `.env`, then restart the database with `docker compose up -d postgres`."
  }

  return "Run `docker compose up -d postgres` and verify `POSTGRES_URL` in `.env`."
}
