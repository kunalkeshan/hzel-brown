import { notFound } from "next/navigation";
import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  MENU_ITEMS_BY_CATEGORY_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  MENU_FILTERS_DATA_QUERY,
  MENU_CATEGORIES_QUERY,
} from "@/sanity/queries/menu";
import type {
  MENU_ITEMS_BY_CATEGORY_QUERYResult,
  CATEGORY_BY_SLUG_QUERYResult,
  MENU_FILTERS_DATA_QUERYResult,
  MENU_CATEGORIES_QUERYResult,
} from "@/types/cms";
import { MenuPageContent } from "@/components/menu/menu-page-content";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site-config";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";
import { urlFor } from "@/sanity/lib/image";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = await sanityFetch<MENU_CATEGORIES_QUERYResult>({
    query: MENU_CATEGORIES_QUERY,
    tags: ["menuCategories"],
  });

  return categories
    .map((category) => ({
      category: category.slug?.current || "",
    }))
    .filter((params) => params.category); // Filter out empty slugs
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  const [categoryData, siteConfig] = await Promise.all([
    sanityFetch<CATEGORY_BY_SLUG_QUERYResult>({
      query: CATEGORY_BY_SLUG_QUERY,
      params: { slug: category },
    }),
    sanityFetch<SITE_CONFIG_QUERYResult>({
      query: SITE_CONFIG_QUERY,
      tags: ["siteConfig"],
    }),
  ]);

  if (!categoryData) {
    return {
      title: "Menu",
      description: "Menu",
    };
  }

  const title = categoryData.title || "What We Bake";
  const description =
    categoryData.description ||
    "Discover our delicious selection of freshly baked goods, artisanal treats, and specialty items crafted with love and the finest ingredients.";

  // Use category thumbnail if available, otherwise fall back to site config images
  const ogImageUrl = categoryData.thumbnail?.asset
    ? urlFor(categoryData.thumbnail)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : siteConfig?.ogImage?.asset
    ? urlFor(siteConfig.ogImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : undefined;

  const twitterImageUrl = categoryData.thumbnail?.asset
    ? urlFor(categoryData.thumbnail)
        .width(1200)
        .height(600)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : siteConfig?.twitterImage?.asset
    ? urlFor(siteConfig.twitterImage)
        .width(1200)
        .height(600)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : ogImageUrl;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              alt:
                categoryData.thumbnail?.alt ||
                siteConfig?.ogImage?.alt ||
                title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
  };
}

export default async function MenuItemsByCategoryPage({ params }: PageProps) {
  const { category } = await params;

  const [categoryData, menuItems, filterData, siteConfig] = await Promise.all([
    sanityFetch<CATEGORY_BY_SLUG_QUERYResult>({
      query: CATEGORY_BY_SLUG_QUERY,
      params: { slug: category },
    }),
    sanityFetch<MENU_ITEMS_BY_CATEGORY_QUERYResult>({
      query: MENU_ITEMS_BY_CATEGORY_QUERY,
      params: { categorySlug: category },
    }),
    sanityFetch<MENU_FILTERS_DATA_QUERYResult>({
      query: MENU_FILTERS_DATA_QUERY,
    }),
    sanityFetch<SITE_CONFIG_QUERYResult>({
      query: SITE_CONFIG_QUERY,
      tags: ["siteConfig"],
    }),
  ]);

  if (!categoryData) {
    notFound();
  }

  return (
    <main className="py-16 lg:pt-40">
      <div className="border-b border-gray-200 pb-10 container">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {categoryData.title || "Menu"}
        </h1>
        {categoryData.description && (
          <p className="mt-4 text-base text-gray-500">
            {categoryData.description}
          </p>
        )}
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
          lockedCategorySlug={category}
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
