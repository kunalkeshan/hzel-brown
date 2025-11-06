"use client";

import Link from "next/link";
import Image from "next/image";
import * as motion from "motion/react-client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { urlFor } from "@/sanity/lib/image";
import type { ALL_CATEGORIES_QUERYResult } from "@/types/cms";

type Category = NonNullable<ALL_CATEGORIES_QUERYResult>[number];

interface CategoryCardProps {
  category: Category;
  index?: number;
  animationDelay?: number;
  animationDuration?: number;
  animationY?: number;
}

export function CategoryCard({
  category,
  index = 0,
  animationDelay = 0.1,
  animationDuration = 0.6,
  animationY = 20,
}: CategoryCardProps) {
  const imageUrl = category.thumbnail?.asset
    ? urlFor(category.thumbnail.asset)
        .format("webp")
        .quality(80)
        .width(600)
        .height(400)
        .url()
    : null;

  const categorySlug = category.slug?.current;

  if (!categorySlug) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: animationY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: animationDuration,
        delay: index * animationDelay,
      }}
    >
      <Link href={`/menu/${categorySlug}`} prefetch={false}>
        <Card className="h-full transition-all duration-300 hover:shadow-lg cursor-pointer group overflow-hidden pt-0">
          <div className="w-full aspect-3/2 overflow-hidden relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={category.thumbnail?.alt || category.title || ""}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-primary" />
            )}
          </div>
          <CardHeader>
            <CardTitle className="group-hover:text-primary transition-colors">
              {category.title}
            </CardTitle>
            {category.description && (
              <CardDescription>{category.description}</CardDescription>
            )}
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}

