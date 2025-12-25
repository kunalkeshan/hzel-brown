import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

/**
 * Type definition for menu items used in sorting
 */
type SortableMenuItem = {
  _id: string;
  name?: string | null;
  [key: string]: any;
};

/**
 * Sorts menu items with featured items appearing first (in their featured order),
 * followed by non-featured items in alphabetical order by name.
 *
 * @param items - Array of menu items to sort
 * @param featuredItemIds - Array of featured item IDs in their display order
 * @returns Sorted array with featured items first, then alphabetical items
 */
export function sortMenuItemsByFeatured<T extends SortableMenuItem>(
  items: T[],
  featuredItemIds: string[]
): T[] {
  // Create a map of featured item IDs to their priority index
  const featuredIndexMap = new Map<string, number>();
  featuredItemIds.forEach((id, index) => {
    featuredIndexMap.set(id, index);
  });

  // Separate featured and non-featured items
  const featuredItems: T[] = [];
  const nonFeaturedItems: T[] = [];

  items.forEach((item) => {
    if (featuredIndexMap.has(item._id)) {
      featuredItems.push(item);
    } else {
      nonFeaturedItems.push(item);
    }
  });

  // Sort featured items by their order in featuredItemIds
  featuredItems.sort((a, b) => {
    const indexA = featuredIndexMap.get(a._id) ?? Infinity;
    const indexB = featuredIndexMap.get(b._id) ?? Infinity;
    return indexA - indexB;
  });

  // Sort non-featured items alphabetically by name
  nonFeaturedItems.sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Return featured items first, then non-featured items
  return [...featuredItems, ...nonFeaturedItems];
}

/**
 * Sorts menu items for category pages with multiple levels of featured priority:
 * 1. Global featured items (from siteConfig) that belong to this category
 * 2. Category-specific featured items
 * 3. Non-featured items in alphabetical order
 *
 * @param items - Array of menu items to sort
 * @param globalFeaturedItemIds - Array of global featured item IDs (from siteConfig)
 * @param categoryFeaturedItemIds - Array of category-specific featured item IDs
 * @returns Sorted array with global featured first, then category featured, then alphabetical
 */
export function sortMenuItemsByCategoryFeatured<T extends SortableMenuItem>(
  items: T[],
  globalFeaturedItemIds: string[],
  categoryFeaturedItemIds: string[]
): T[] {
  // Create maps for both featured lists
  const globalFeaturedIndexMap = new Map<string, number>();
  globalFeaturedItemIds.forEach((id, index) => {
    globalFeaturedIndexMap.set(id, index);
  });

  const categoryFeaturedIndexMap = new Map<string, number>();
  categoryFeaturedItemIds.forEach((id, index) => {
    categoryFeaturedIndexMap.set(id, index);
  });

  // Separate items into three groups
  const globalFeaturedItems: T[] = [];
  const categoryFeaturedItems: T[] = [];
  const nonFeaturedItems: T[] = [];

  items.forEach((item) => {
    if (globalFeaturedIndexMap.has(item._id)) {
      globalFeaturedItems.push(item);
    } else if (categoryFeaturedIndexMap.has(item._id)) {
      categoryFeaturedItems.push(item);
    } else {
      nonFeaturedItems.push(item);
    }
  });

  // Sort global featured items by their order
  globalFeaturedItems.sort((a, b) => {
    const indexA = globalFeaturedIndexMap.get(a._id) ?? Infinity;
    const indexB = globalFeaturedIndexMap.get(b._id) ?? Infinity;
    return indexA - indexB;
  });

  // Sort category featured items by their order
  categoryFeaturedItems.sort((a, b) => {
    const indexA = categoryFeaturedIndexMap.get(a._id) ?? Infinity;
    const indexB = categoryFeaturedIndexMap.get(b._id) ?? Infinity;
    return indexA - indexB;
  });

  // Sort non-featured items alphabetically
  nonFeaturedItems.sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Return in priority order: global featured, category featured, then alphabetical
  return [...globalFeaturedItems, ...categoryFeaturedItems, ...nonFeaturedItems];
}
