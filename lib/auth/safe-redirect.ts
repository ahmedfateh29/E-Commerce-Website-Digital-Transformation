/** Allow only same-origin paths to avoid open redirects. */
export function sanitizeNextParam(next: string | null | undefined, fallback = "/"): string {
  if (!next || typeof next !== "string") return fallback
  const trimmed = next.trim()
  if (!trimmed.startsWith("/")) return fallback
  if (trimmed.startsWith("//")) return fallback
  if (trimmed.includes("/\\")) return fallback
  return trimmed
}
