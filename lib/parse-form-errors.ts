import type { ZodSchema } from "zod"

export function parseFormErrors<T>(
  schema: ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)
  if (result.success) return { success: true, data: result.data }

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    if (issue.path[0]) {
      errors[issue.path[0] as string] = issue.message
    }
  }
  return { success: false, errors }
}
