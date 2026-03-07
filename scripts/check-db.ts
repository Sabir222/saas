import "dotenv/config"
import { checkDbHealth } from "../lib/db-health"

async function main() {
  try {
    const res = await checkDbHealth({ timeoutMs: 1500 })
    console.log(JSON.stringify(res, null, 2))
    if (!res.ok && res.suggestion) {
      console.log(`// ${res.suggestion}`)
    }
    if (!res.ok) process.exit(1)
  } catch (err) {
    console.error("DB health check failed:", err)
    process.exit(2)
  }
}

void main()
