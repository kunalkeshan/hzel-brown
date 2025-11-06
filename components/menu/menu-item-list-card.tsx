"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/numbers";
import { MenuItemCardActions } from "@/components/menu/menu-item-card-actions";
import type {
  ALL_MENU_ITEMS_QUERYResult,
  SITE_CONFIG_QUERYResult,
} from "@/types/cms";

type MenuItemType =
  | NonNullable<ALL_MENU_ITEMS_QUERYResult>[number]
  | NonNullable<
      NonNullable<SITE_CONFIG_QUERYResult>["featuredMenuItems"]
    >[number];

interface MenuItemListCardProps {
  item: MenuItemType;
  className?: string;
  index?: number;
}

export function MenuItemListCard({
  item,
  className,
  index = 0,
}: MenuItemListCardProps) {
  const imageUrl = item.image?.asset
    ? urlFor(item.image.asset)
        .format("webp")
        .quality(80)
        .width(160)
        .height(160)
        .url()
    : null;

  const primaryCategory = item.categories?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn("border-b border-gray-200 last:border-0", className)}
    >
      <div className="group py-6 flex gap-4 md:gap-6 items-start hover:bg-gray-50/50 transition-colors duration-300 px-2 md:px-4 -mx-2 md:-mx-4 rounded-lg">
        {/* Image */}
        <Link
          href={`/menu/${primaryCategory?.slug?.current}/${item.slug?.current}`}
          className="flex-shrink-0 overflow-hidden rounded-lg"
          prefetch={false}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.image?.alt || item.name || ""}
                width={160}
                height={160}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 64px, 80px"
              />
            ) : (
              <div className="w-full h-full bg-primary" />
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-6">
          {/* Left: Name, Category, Description */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-2 md:block">
              <Link
                href={`/menu/${primaryCategory?.slug?.current}/${item.slug?.current}`}
                className="font-semibold text-base md:text-lg leading-tight text-black transition-colors duration-300 hover:text-primary line-clamp-2 flex-1"
                prefetch={false}
              >
                {item.name}
              </Link>
              {/* Price - Mobile only (shown next to name) */}
              <p className="font-semibold text-base text-primary flex-shrink-0 md:hidden">
                {formatCurrency(item.price || 0)}
              </p>
            </div>

            {primaryCategory && (
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                {primaryCategory.title}
              </p>
            )}

            {item.description && (
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2 hidden md:block">
                {item.description}
              </p>
            )}

            {!item.isAvailable && (
              <p className="text-xs md:text-sm font-medium text-red-500">
                Currently unavailable
              </p>
            )}
          </div>

          {/* Right: Price & Actions */}
          <div className="flex items-center md:items-end md:flex-col gap-3 md:gap-2 justify-between md:justify-start flex-shrink-0 md:min-w-[140px]">
            {/* Price - Desktop only */}
            <p className="font-bold text-lg md:text-xl text-primary hidden md:block">
              {formatCurrency(item.price || 0)}
            </p>

            {/* Actions */}
            <div className="flex-1 md:flex-none w-full">
              <MenuItemCardActions item={item} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
