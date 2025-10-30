import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

interface MenuItemCardProps {
  item: NonNullable<
    NonNullable<SITE_CONFIG_QUERYResult>["featuredMenuItems"]
  >[number];
  className?: string;
}

export function MenuItemCard({ item, className }: MenuItemCardProps) {
  const imageUrl = item.image?.asset
    ? urlFor(item.image.asset)
        .format("webp")
        .quality(80)
        .width(400)
        .height(400)
        .url()
    : null;

  const primaryCategory = item.categories?.[0];

  return (
    <Link
      href={`/menu/${primaryCategory?.slug?.current}/${item.slug?.current}`}
      className={cn(
        "group cursor-pointer bg-white transition-all duration-500 block overflow-hidden group rounded-2xl relative w-full",
        className
      )}
      prefetch={false}
    >
      <div className="w-full aspect-square overflow-hidden relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.image?.alt || item.name || ""}
            width={400}
            height={400}
            className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full aspect-square rounded-2xl bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}

        {primaryCategory && (
          <Badge className="absolute top-2 right-2 backdrop-blur-sm bg-white text-black">
            {primaryCategory.title}
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <p className="font-semibold text-lg leading-8 text-black transition-all duration-500 group-hover:text-primary">
          {item.name}
        </p>
        <p className="font-semibold text-base leading-6 text-primary">
          ₹{item.price}
        </p>

        {!item.isAvailable && (
          <p className="font-medium text-sm text-red-500">
            Currently unavailable
          </p>
        )}
      </div>
    </Link>
  );
}
