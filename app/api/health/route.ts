import { checkDbHealth } from "@/lib/db-health"

export const runtime = "nodejs"

export async function GET() {
  const result = await checkDbHealth({ timeoutMs: 1500 })

  return Response.json(result, {
    status: result.ok ? 200 : 503,
  })
}
