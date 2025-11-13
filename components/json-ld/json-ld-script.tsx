import type { Thing, WithContext } from "schema-dts";
import { sanitizeJsonLd } from "@/lib/json-ld/utils";

interface JsonLdScriptProps {
  /**
   * The JSON-LD schema object to render
   */
  data: WithContext<Thing>;
}

/**
 * Renders a JSON-LD script tag with proper sanitization
 * This is a server component that safely injects structured data
 *
 * @see https://nextjs.org/docs/app/guides/json-ld
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: sanitizeJsonLd(data),
      }}
    />
  );
}
