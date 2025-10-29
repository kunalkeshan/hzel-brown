import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  //   const [cities, packages, legalDocs] = await Promise.all([
  //     sanityFetch<CITIES_QUERYResult>({
  //       query: CITIES_QUERY,
  //     }),
  //     sanityFetch<TOUR_PACKAGES_QUERYResult>({
  //       query: TOUR_PACKAGES_QUERY,
  //     }),
  //     sanityFetch<LEGAL_DOCUMENTS_QUERYResult>({
  //       query: LEGAL_DOCUMENTS_QUERY,
  //     }),
  //   ]);

  // Generate legal document entries
  //   const legalEntries: MetadataRoute.Sitemap = legalDocs.map((doc) => ({
  //     url: `${SITE_CONFIG.URL}/legals/${doc.slug?.current}`,
  //     lastModified: doc._updatedAt ? new Date(doc._updatedAt) : new Date(),
  //     changeFrequency: 'yearly',
  //     priority: 0.3,
  //   }));

  return [
    // Static pages
    {
      url: SITE_CONFIG.URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/menu`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/legals`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Dynamic pages
    // ...legalEntries,
  ];
}
