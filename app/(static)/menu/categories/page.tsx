import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/menu";
import type { ALL_CATEGORIES_QUERYResult } from "@/types/cms";
import { MotionSection } from "@/components/ui/motion-section";
import { CategoryCardsGrid } from "@/components/common/category-cards-grid";
import type { Metadata } from "next";
import { createCollectionTag } from "@/sanity/lib/cache-tags";

export const metadata: Metadata = {
  title: "What We Bake",
  description:
    "Explore our carefully curated menu categories, each featuring handcrafted desserts and treats made with the finest ingredients.",
};

export default async function CategoriesPage() {
  const categories = await sanityFetch<ALL_CATEGORIES_QUERYResult>({
    query: ALL_CATEGORIES_QUERY,
    tags: [createCollectionTag("menuCategory")],
  });

  return (
    <main className="py-16 lg:pt-40">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:max-w-7xl">
          {/* Header Section */}
          <MotionSection className="border-b border-border pb-10 mb-10">
            <h1 className="text-pretty text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
              What We Bake
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-muted-foreground sm:max-w-md sm:text-xl/8 lg:max-w-none">
              Explore our carefully curated menu categories, each featuring
              handcrafted desserts and treats made with the finest ingredients.
            </p>
          </MotionSection>

          {/* Categories Grid */}
          <CategoryCardsGrid categories={categories} />
        </div>
      </div>
    </main>
  );
}
