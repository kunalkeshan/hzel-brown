import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  MENU_ITEM_BY_SLUGS_QUERY,
  ALL_MENU_ITEMS_QUERY,
} from "@/sanity/queries/menu";
import type {
  MENU_ITEM_BY_SLUGS_QUERYResult,
  ALL_MENU_ITEMS_QUERYResult,
} from "@/types/cms";
import { MenuItemDisplay } from "@/components/menu/menu-item-display";
import { MenuItemDetails } from "@/components/menu/menu-item-details";
import { RelatedMenuItems } from "@/components/menu/related-menu-items";
import { MotionSection } from "@/components/ui/motion-section";
import type { Metadata } from "next";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site-config";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";
import { urlFor } from "@/sanity/lib/image";
import { createCollectionTag, createDocumentTag } from "@/sanity/lib/cache-tags";

interface PageProps {
  params: Promise<{
    category: string;
    item: string;
  }>;
}

export async function generateStaticParams() {
  const menuItems = await sanityFetch<ALL_MENU_ITEMS_QUERYResult>({
    query: ALL_MENU_ITEMS_QUERY,
    tags: [createCollectionTag("menuItem")],
  });

  const params: Array<{ category: string; item: string }> = [];

  menuItems.forEach((item) => {
    const itemSlug = item.slug?.current;
    if (!itemSlug) return;

    item.categories?.forEach((category) => {
      const categorySlug = category.slug?.current;
      if (categorySlug) {
        params.push({
          category: categorySlug,
          item: itemSlug,
        });
      }
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, item } = await params;

  const [data, siteConfig] = await Promise.all([
    sanityFetch<MENU_ITEM_BY_SLUGS_QUERYResult>({
      query: MENU_ITEM_BY_SLUGS_QUERY,
      params: {
        categorySlug: category,
        itemSlug: item,
      },
      tags: [createCollectionTag("menuItem"), createDocumentTag("menuItem", item), createDocumentTag("menuCategory", category)],
    }),
    sanityFetch<SITE_CONFIG_QUERYResult>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
  ]);

  if (!data?.item) {
    return {
      title: "Menu Item",
      description: "Menu Item",
    };
  }

  const title =
    `${data.item.name} - ${data.item.categories
      ?.map((c) => c.title)
      .join(", ")}` || "Menu Item";
  const description =
    data.item.description ||
    "Discover our delicious selection of freshly baked goods, artisanal treats, and specialty items crafted with love and the finest ingredients.";

  // Use menu item image if available, otherwise fall back to site config images
  const ogImageUrl = data.item.image?.asset
    ? urlFor(data.item.image)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : siteConfig?.ogImage?.asset
    ? urlFor(siteConfig.ogImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : undefined;

  const twitterImageUrl = data.item.image?.asset
    ? urlFor(data.item.image)
        .width(1200)
        .height(600)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : siteConfig?.twitterImage?.asset
    ? urlFor(siteConfig.twitterImage)
        .width(1200)
        .height(600)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : ogImageUrl;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              alt: data.item.image?.alt || siteConfig?.ogImage?.alt || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
  };
}

export default async function IndividualMenuItemPage({ params }: PageProps) {
  const { category, item } = await params;

  const data = await sanityFetch<MENU_ITEM_BY_SLUGS_QUERYResult>({
    query: MENU_ITEM_BY_SLUGS_QUERY,
    params: {
      categorySlug: category,
      itemSlug: item,
    },
    tags: [createCollectionTag("menuItem"), createDocumentTag("menuItem", item), createDocumentTag("menuCategory", category)],
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
