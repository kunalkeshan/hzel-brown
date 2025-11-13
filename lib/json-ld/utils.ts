import type { Thing, WithContext } from "schema-dts";

/**
 * Sanitizes JSON-LD data to prevent XSS attacks
 * Replaces potentially dangerous HTML characters with their unicode equivalents
 * to prevent HTML injection when embedded in script tags
 * @see https://nextjs.org/docs/app/guides/json-ld#rendering-json-ld-in-your-layouts
 */
export function sanitizeJsonLd<T extends Thing>(
  jsonLd: WithContext<T>
): string {
  return JSON.stringify(jsonLd)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
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
 * Business logic: Treats null/undefined as OutOfStock (conservative approach)
 * Only explicitly true values are marked as InStock
 */
export function getAvailability(
  isAvailable: boolean | null | undefined
): "https://schema.org/InStock" | "https://schema.org/OutOfStock" {
  return isAvailable === true
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}
