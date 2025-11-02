import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "@/components/ui/badge";
import type { MENU_ITEM_BY_SLUGS_QUERYResult } from "@/types/cms";

type MenuItemType = NonNullable<MENU_ITEM_BY_SLUGS_QUERYResult["item"]>;

interface MenuItemDisplayProps {
  item: MenuItemType;
}

export function MenuItemDisplay({ item }: MenuItemDisplayProps) {
  const imageUrl = item.image?.asset
    ? urlFor(item.image.asset)
        .format("webp")
        .quality(80)
        .width(800)
        .height(800)
        .url()
    : null;

  const primaryCategory = item.categories?.[0];

  return (
    <div className="relative">
      {/* Image */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted sm:rounded-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.image?.alt || item.name || ""}
            width={800}
            height={800}
            className="h-full w-full object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Category Badge on Image */}
      {primaryCategory && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="backdrop-blur-sm bg-white/90 text-black">
            {primaryCategory.title}
          </Badge>
        </div>
      )}
    </div>
  );
}
