"use client";

import { useEffect, useState } from "react";
import { SocialShare } from "@/components/social-share";
import type { MENU_ITEM_BY_SLUGS_QUERYResult } from "@/types/cms";

type MenuItemType = NonNullable<MENU_ITEM_BY_SLUGS_QUERYResult["item"]>;

interface MenuItemSocialShareProps {
  item: MenuItemType;
}

export function MenuItemSocialShare({ item }: MenuItemSocialShareProps) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // Get the current page URL on the client side
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  // Don't render until we have the URL
  if (!url) {
    return null;
  }

  const primaryCategory = item.categories?.[0];
  const title = `${item.name}${primaryCategory ? ` - ${primaryCategory.title}` : ""}`;
  const description = item.description || "";

  return (
    <SocialShare
      url={url}
      title={title}
      description={description}
      className="mt-3"
    />
  );
}
