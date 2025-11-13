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
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: siteDescription,
    url: baseUrl,
    // TODO: Add SearchAction when search functionality is implemented
    // Only include potentialAction if you have working search functionality
    // to avoid validation warnings and poor UX when Google displays a search box
    // potentialAction: {
    //   "@type": "SearchAction",
    //   target: {
    //     "@type": "EntryPoint",
    //     urlTemplate: createAbsoluteUrl("/menu?search={search_term_string}", baseUrl),
    //   },
    //   "query-input": "required name=search_term_string",
    // },
  } as WithContext<WebSite>;

  return schema;
}
