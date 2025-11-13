import type { Thing, WithContext } from "schema-dts";

/**
 * Sanitizes JSON-LD data to prevent XSS attacks
 * Replaces < characters with their unicode equivalent to prevent HTML injection
 * @see https://nextjs.org/docs/app/guides/json-ld#rendering-json-ld-in-your-layouts
 */
export function sanitizeJsonLd<T extends Thing>(
  jsonLd: WithContext<T>
): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

/**
 * Creates a fully qualified URL from a path
 */
export function createAbsoluteUrl(path: string, baseUrl: string): string {
  // Remove trailing slash from baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
}

/**
 * Formats a price value for schema.org
 * Removes currency symbols and returns a clean decimal string
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Converts availability boolean to schema.org ItemAvailability
 */
export function getAvailability(
  isAvailable: boolean | null | undefined
): "https://schema.org/InStock" | "https://schema.org/OutOfStock" {
  return isAvailable
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}
