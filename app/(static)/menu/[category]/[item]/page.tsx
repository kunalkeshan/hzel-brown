import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { MENU_ITEM_BY_SLUGS_QUERY } from "@/sanity/queries/menu";
import type { MENU_ITEM_BY_SLUGS_QUERYResult } from "@/types/cms";
import { MenuItemDisplay } from "@/components/menu/menu-item-display";
import { MenuItemDetails } from "@/components/menu/menu-item-details";
import { RelatedMenuItems } from "@/components/menu/related-menu-items";
import { MotionSection } from "@/components/ui/motion-section";

interface PageProps {
  params: Promise<{
    category: string;
    item: string;
  }>;
}

export default async function IndividualMenuItemPage({ params }: PageProps) {
  const { category, item } = await params;

  const data = await sanityFetch<MENU_ITEM_BY_SLUGS_QUERYResult>({
    query: MENU_ITEM_BY_SLUGS_QUERY,
    params: {
      categorySlug: category,
      itemSlug: item,
    },
  });

  if (!data?.item) {
    notFound();
  }

  return (
    <main className="py-16 lg:pt-40">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:max-w-7xl">
          <MotionSection className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image */}
            <div className="lg:col-span-1 h-fit lg:sticky lg:top-32">
              <MenuItemDisplay item={data.item} />
            </div>

            {/* Product Info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:col-span-1 lg:mt-0">
              <MenuItemDetails item={data.item} />
            </div>
          </MotionSection>

          {/* Related Items */}
          {data.relatedItems && data.relatedItems.length > 0 && (
            <RelatedMenuItems items={data.relatedItems} />
          )}
        </div>
      </div>
    </main>
  );
}
