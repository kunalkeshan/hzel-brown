import type { WithContext, WebSite } from "schema-dts";
import { createAbsoluteUrl } from "./utils";

interface WebSiteSchemaProps {
  siteName: string;
  siteDescription: string;
  baseUrl: string;
}

/**
 * Generates WebSite schema with search action
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 */
export function generateWebSiteSchema({
  siteName,
  siteDescription,
  baseUrl,
}: WebSiteSchemaProps): WithContext<WebSite> {
  // Using type assertion for potentialAction because schema-dts doesn't include
  // the query-input property, but it's valid according to schema.org specification
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: siteDescription,
    url: baseUrl,
    // SearchAction enables Google's sitelinks searchbox feature
    // Search is implemented on /menu page using nuqs for URL state management
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: createAbsoluteUrl("/menu?search={search_term_string}", baseUrl),
      },
      "query-input": "required name=search_term_string",
    },
  } as WithContext<WebSite>;

  return schema;
}
