"use client";

import { useMemo } from "react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import type {
  ALL_MENU_ITEMS_QUERYResult,
  MENU_FILTERS_DATA_QUERYResult,
} from "@/types/cms";

type MenuItem = NonNullable<ALL_MENU_ITEMS_QUERYResult>[number];
type FilterData = MENU_FILTERS_DATA_QUERYResult;

interface UseMenuFiltersProps {
  menuItems: MenuItem[];
  filterData: FilterData;
}

export function useMenuFilters({ menuItems, filterData }: UseMenuFiltersProps) {
  // Ensure we have valid price range values
  const defaultMinPrice = filterData?.priceRange?.min ?? 100;
  // const defaultMaxPrice = filterData?.priceRange?.max ?? 5000;
  const defaultMaxPrice = 5000;

  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    categories: parseAsArrayOf(parseAsString).withDefault([]), // This will store slugs
    allergens: parseAsArrayOf(parseAsString).withDefault([]),
    minPrice: parseAsInteger.withDefault(defaultMinPrice),
    maxPrice: parseAsInteger.withDefault(defaultMaxPrice),
  });

  // Helper function to convert category slugs to IDs for filtering
  const getCategoryIdsFromSlugs = (slugs: string[]) => {
    if (!filterData?.categories) return [];
    return filterData.categories
      .filter((category) => slugs.includes(category.slug?.current || ""))
      .map((category) => category._id);
  };

  // Helper function to convert category IDs to slugs for URL
  const getCategorySlugsFromIds = (ids: string[]) => {
    if (!filterData?.categories) return [];
    return filterData.categories
      .filter((category) => ids.includes(category._id))
      .map((category) => category.slug?.current || "")
      .filter((slug) => slug !== "");
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Search filter - search in item name
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!item.name?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter - convert slugs to IDs for filtering
      if (filters.categories.length > 0) {
        const selectedCategoryIds = getCategoryIdsFromSlugs(filters.categories);
        const itemCategoryIds = item.categories?.map((cat) => cat._id) || [];
        const hasMatchingCategory = selectedCategoryIds.some((categoryId) =>
          itemCategoryIds.includes(categoryId)
        );
        if (!hasMatchingCategory) {
          return false;
        }
      }

      // Allergen filter - exclude items that contain selected allergens
      if (filters.allergens.length > 0) {
        const itemAllergens = item.allergens || [];
        const hasExcludedAllergen = filters.allergens.some((allergen) =>
          itemAllergens.includes(allergen)
        );
        if (hasExcludedAllergen) {
          return false;
        }
      }

      // Price filter
      if (
        !item.price ||
        item.price < filters.minPrice ||
        item.price > filters.maxPrice
      ) {
        return false;
      }

      return true;
    });
  }, [menuItems, filters]);

  const updateSearch = (search: string) => {
    setFilters({ search });
  };

  const updateCategories = (categoryIds: string[]) => {
    // Convert category IDs to slugs for URL
    const categorySlugs = getCategorySlugsFromIds(categoryIds);
    setFilters({ categories: categorySlugs });
  };

  const updateAllergens = (allergens: string[]) => {
    setFilters({ allergens });
  };

  const updatePriceRange = (minPrice: number, maxPrice: number) => {
    setFilters({ minPrice, maxPrice });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      allergens: [],
      minPrice: defaultMinPrice,
      maxPrice: defaultMaxPrice,
    });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.categories.length > 0 ||
    filters.allergens.length > 0 ||
    filters.minPrice !== defaultMinPrice ||
    filters.maxPrice !== defaultMaxPrice;

  // Convert current URL slugs back to IDs for the filter components
  const selectedCategoryIds = getCategoryIdsFromSlugs(filters.categories);

  return {
    filters: {
      ...filters,
      categories: selectedCategoryIds, // Return IDs for filter components
    },
    filteredItems,
    updateSearch,
    updateCategories,
    updateAllergens,
    updatePriceRange,
    clearFilters,
    hasActiveFilters,
    totalItems: menuItems.length,
    filteredCount: filteredItems.length,
  };
}
