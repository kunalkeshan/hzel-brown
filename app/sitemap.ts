import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  MENU_CATEGORIES_QUERY,
  ALL_MENU_ITEMS_QUERY,
} from "@/sanity/queries/menu";
import { LEGAL_DOCUMENTS_QUERY } from "@/sanity/queries/legal";
import type {
  MENU_CATEGORIES_QUERYResult,
  ALL_MENU_ITEMS_QUERYResult,
  LEGAL_DOCUMENTS_QUERYResult,
} from "@/types/cms";
import { createCollectionTag } from "@/sanity/lib/cache-tags";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  const [menuCategories, menuItems, legalDocs] = await Promise.all([
    sanityFetch<MENU_CATEGORIES_QUERYResult>({
      query: MENU_CATEGORIES_QUERY,
      tags: [createCollectionTag("menuCategory")],
    }),
    sanityFetch<ALL_MENU_ITEMS_QUERYResult>({
      query: ALL_MENU_ITEMS_QUERY,
      tags: [createCollectionTag("menuItem")],
    }),
    sanityFetch<LEGAL_DOCUMENTS_QUERYResult>({
      query: LEGAL_DOCUMENTS_QUERY,
      tags: [createCollectionTag("legal")],
    }),
  ]);

  // Generate menu category entries
  const categoryEntries: MetadataRoute.Sitemap = menuCategories
    .filter((category) => category.slug?.current)
    .map((category) => ({
      url: `${SITE_CONFIG.URL}/menu/${category.slug?.current}`,
      lastModified: category._updatedAt
        ? new Date(category._updatedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Generate menu item entries (items can belong to multiple categories)
  const itemEntries: MetadataRoute.Sitemap = [];
  menuItems.forEach((item) => {
    const itemSlug = item.slug?.current;
    if (!itemSlug) return;

    item.categories?.forEach((category) => {
      const categorySlug = category.slug?.current;
      if (categorySlug) {
        itemEntries.push({
          url: `${SITE_CONFIG.URL}/menu/${categorySlug}/${itemSlug}`,
          lastModified: item._updatedAt
            ? new Date(item._updatedAt)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      }
    });
  });

  // Generate legal document entries
  const legalEntries: MetadataRoute.Sitemap = legalDocs
    .filter((doc) => doc.slug?.current)
    .map((doc) => ({
      url: `${SITE_CONFIG.URL}/legals/${doc.slug?.current}`,
      lastModified: doc._updatedAt ? new Date(doc._updatedAt) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }));

  return [
    // Static pages
    {
      url: SITE_CONFIG.URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/menu`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/menu/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.URL}/legals`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    // Dynamic pages
    ...categoryEntries,
    ...itemEntries,
    ...legalEntries,
  ];
}
