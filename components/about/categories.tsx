import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/menu";
import type { ALL_CATEGORIES_QUERYResult } from "@/types/cms";
import { MotionSection } from "@/components/ui/motion-section";
import { CategoryCardsGrid } from "@/components/common/category-cards-grid";
import { createCollectionTag } from "@/sanity/lib/cache-tags";

export async function Categories() {
  const categories = await sanityFetch<ALL_CATEGORIES_QUERYResult>({
    query: ALL_CATEGORIES_QUERY,
    tags: [createCollectionTag("menuCategory")],
  });

  return (
    <MotionSection className="py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-14">
          {/* Text Content */}
          <div className="flex flex-col gap-3 h-fit lg:sticky lg:top-32">
            <h2 className="text-4xl font-bold text-foreground font-serif text-center xl:text-start">
              Our Homemade Selection
            </h2>
            <p className="text-xl font-normal leading-8 text-muted-foreground text-center xl:text-start">
              Explore our carefully curated menu categories, each featuring
              handcrafted desserts and treats made with the finest ingredients.
            </p>
          </div>

          {/* Categories Grid */}
          <CategoryCardsGrid
            categories={categories}
            gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2"
          />
        </div>
      </div>
    </MotionSection>
  );
}
