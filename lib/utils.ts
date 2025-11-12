import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes image URLs coming from the database or uploads so they can be used safely
 * with the Next.js <Image> component.
 *
 * - Returns a placeholder when the URL is missing.
 * - Keeps absolute URLs (http/https/data) intact.
 * - Ensures relative paths always start with a leading slash so they resolve from the app root.
 */
export function resolveImageUrl(url?: string | null) {
  if (!url) {
    return "/placeholder.svg"
  }

  const trimmed = url.trim()
  const lower = trimmed.toLowerCase()

  if (lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("data:")) {
    return trimmed
  }

  if (trimmed.startsWith("/")) {
    return trimmed
  }

  return `/${trimmed.replace(/^\/+/, "")}`
}