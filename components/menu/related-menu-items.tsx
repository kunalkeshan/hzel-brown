import { MotionSection } from "@/components/ui/motion-section";
import { MenuItemCard } from "./menu-item-card";
import type { MENU_ITEM_BY_SLUGS_QUERYResult } from "@/types/cms";

type RelatedItemType = MENU_ITEM_BY_SLUGS_QUERYResult["relatedItems"][number];

interface RelatedMenuItemsProps {
  items: RelatedItemType[];
}

export function RelatedMenuItems({ items }: RelatedMenuItemsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <MotionSection className="mt-24">
      <div className="text-center mb-12">
        <p className="px-2 border border-primary/30 rounded-full bg-primary/10 text-xs font-medium leading-6 text-primary mb-4 w-fit mx-auto">
          You May Also Like
        </p>
        <h2 className="font-serif text-4xl text-foreground font-bold mb-4">
          Related Items
        </h2>
        <p className="text-xl font-normal leading-8 text-muted-foreground max-w-2xl mx-auto">
          Discover more delicious treats from the same category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, index) => (
          <MenuItemCard
            key={item._id}
            item={item}
            index={index}
            className="mx-auto sm:mx-0"
          />
        ))}
      </div>
    </MotionSection>
  );
}
