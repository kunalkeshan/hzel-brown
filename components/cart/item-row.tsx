"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Trash2, Check, Clock, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types/cart";

interface ItemRowProps {
  item: CartItem;
}

export function ItemRow({ item }: ItemRowProps) {
  const { incrementQuantity, decrementQuantity, removeItem, formatPrice } =
    useCart();

  // Memoize image URL generation to avoid recalculation
  const imageUrl = useMemo(
    () =>
      item.image?.asset
        ? urlFor(item.image.asset)
            .format("webp")
            .quality(80)
            .width(400)
            .height(400)
            .url()
        : null,
    [item.image]
  );

  const primaryCategory = item.categories?.[0];
  const categorySlug = primaryCategory?.slug?.current;
  const itemSlug = item.slug?.current;
  const itemLink =
    categorySlug && itemSlug
      ? (`/menu/${categorySlug}/${itemSlug}` as const)
      : null;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="flex py-6 sm:py-10"
    >
      <div className="shrink-0">
        {itemLink ? (
          <Link href={itemLink}>
            {imageUrl ? (
              <Image
                alt={item.image?.alt || item.name || ""}
                src={imageUrl}
                width={192}
                height={192}
                className="size-24 rounded-md object-cover sm:size-48"
              />
            ) : (
              <div className="size-24 rounded-md bg-muted flex items-center justify-center sm:size-48">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
          </Link>
        ) : (
          <>
            {imageUrl ? (
              <Image
                alt={item.image?.alt || item.name || ""}
                src={imageUrl}
                width={192}
                height={192}
                className="size-24 rounded-md object-cover sm:size-48"
              />
            ) : (
              <div className="size-24 rounded-md bg-muted flex items-center justify-center sm:size-48">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                {itemLink ? (
                  <Link
                    href={itemLink}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">
                    {item.name}
                  </span>
                )}
              </h3>
            </div>
            {primaryCategory && (
              <div className="mt-1 flex text-sm">
                <p className="text-muted-foreground">{primaryCategory.title}</p>
              </div>
            )}
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatPrice(item.price || 0)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => decrementQuantity(item._id)}
                className="h-8 w-8"
                type="button"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-8 text-center text-base font-medium">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => incrementQuantity(item._id)}
                className="h-8 w-8"
                disabled={!item.isAvailable}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Remove Button */}
            <div className="absolute top-0 right-0 mt-4 sm:mt-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeItem(item._id)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Remove item from cart"
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stock Availability */}
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          {item.isAvailable ? (
            <>
              <Check
                aria-hidden="true"
                className="size-5 shrink-0 text-green-600"
              />
              <span>In stock</span>
            </>
          ) : (
            <>
              <Clock
                aria-hidden="true"
                className="size-5 shrink-0 text-muted-foreground"
              />
              <span>Currently unavailable</span>
            </>
          )}
        </p>
      </div>
    </motion.li>
  );
}
