import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  ALL_MENU_ITEMS_QUERY,
  MENU_FILTERS_DATA_QUERY,
} from "@/sanity/queries/menu";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site-config";
import type {
  ALL_MENU_ITEMS_QUERYResult,
  MENU_FILTERS_DATA_QUERYResult,
  SITE_CONFIG_QUERYResult,
} from "@/types/cms";
import { MenuPageContent } from "@/components/menu/menu-page-content";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { createCollectionTag } from "@/sanity/lib/cache-tags";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Discover our delicious selection of freshly baked goods, artisanal treats, and specialty items crafted with love and the finest ingredients.",
};

export default async function MenuItemsPage() {
  const [menuItems, filterData, siteConfig] = await Promise.all([
    sanityFetch<ALL_MENU_ITEMS_QUERYResult>({
      query: ALL_MENU_ITEMS_QUERY,
      tags: [createCollectionTag("menuItem")],
    }),
    sanityFetch<MENU_FILTERS_DATA_QUERYResult>({
      query: MENU_FILTERS_DATA_QUERY,
      tags: [createCollectionTag("menuCategory"), createCollectionTag("menuItem")],
    }),
    sanityFetch<SITE_CONFIG_QUERYResult>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
  ]);

  return (
    <main className="py-16 lg:pt-40">
      <div className="border-b border-gray-200 pb-10 container">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Our Menu
        </h1>
        <p className="mt-4 text-base text-gray-500">
          Discover our delicious selection of freshly baked goods, artisanal
          treats, and specialty items crafted with love and the finest
          ingredients.
        </p>
      </div>

      <Suspense
        fallback={
          <MenuPageSkeleton
            useGridLayout={siteConfig?.enableMenuPageGridView ?? true}
          />
        }
      >
        <MenuPageContent
          menuItems={menuItems || []}
          filterData={
            filterData || {
              categories: [],
              allergens: [],
              priceRange: { min: 100, max: 5000 },
            }
          }
          useGridLayout={siteConfig?.enableMenuPageGridView ?? true}
        />
      </Suspense>
    </main>
  );
}

function MenuPageSkeleton({ useGridLayout = true }: { useGridLayout?: boolean }) {
  return (
    <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4 container">
      <aside className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </aside>
      <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
        {useGridLayout ? (
          // Grid skeleton - matches MenuGrid layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List skeleton - matches MenuList layout
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 md:gap-6 py-6 border-b border-gray-200">
                {/* Image skeleton */}
                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex-shrink-0" />

                {/* Content skeleton */}
                <div className="flex-1 flex flex-col md:flex-row md:justify-between gap-2 md:gap-6">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full hidden md:block" />
                  </div>
                  <div className="flex items-center md:flex-col gap-2 md:items-end">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
