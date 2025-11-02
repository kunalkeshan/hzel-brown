import { notFound } from "next/navigation";
import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  MENU_ITEMS_BY_CATEGORY_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  MENU_FILTERS_DATA_QUERY,
} from "@/sanity/queries/menu";
import type {
  MENU_ITEMS_BY_CATEGORY_QUERYResult,
  CATEGORY_BY_SLUG_QUERYResult,
  MENU_FILTERS_DATA_QUERYResult,
} from "@/types/cms";
import { MenuPageContent } from "@/components/menu/menu-page-content";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function MenuItemsByCategoryPage({ params }: PageProps) {
  const { category } = await params;

  const [categoryData, menuItems, filterData] = await Promise.all([
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

      <Suspense fallback={<MenuPageSkeleton />}>
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
        />
      </Suspense>
    </main>
  );
}

function MenuPageSkeleton() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
      </div>
    </div>
  );
}
