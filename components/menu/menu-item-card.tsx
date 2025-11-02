"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/numbers";
import { Badge } from "@/components/ui/badge";
import type {
  ALL_MENU_ITEMS_QUERYResult,
  SITE_CONFIG_QUERYResult,
} from "@/types/cms";

type MenuItemType =
  | NonNullable<ALL_MENU_ITEMS_QUERYResult>[number]
  | NonNullable<
      NonNullable<SITE_CONFIG_QUERYResult>["featuredMenuItems"]
    >[number];

interface MenuItemCardProps {
  item: MenuItemType;
  className?: string;
  index?: number;
}

export function MenuItemCard({
  item,
  className,
  index = 0,
}: MenuItemCardProps) {
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="h-full"
    >
      <Link
        href={`/menu/${primaryCategory?.slug?.current}/${item.slug?.current}`}
        className={cn(
          "group cursor-pointer bg-white transition-all duration-500 overflow-hidden rounded-lg relative w-full h-full flex flex-col",
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

        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="font-semibold text-lg leading-7 text-black transition-all duration-500 group-hover:text-primary line-clamp-2 min-h-14">
            {item.name}
          </p>
          <div className="mt-auto">
            <p className="font-semibold text-base leading-6 text-primary">
              {formatCurrency(item.price || 0)}
            </p>
            {!item.isAvailable && (
              <p className="font-medium text-sm text-red-500 mt-1">
                Currently unavailable
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
