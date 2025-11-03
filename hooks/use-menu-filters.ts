"use client";

import { useMemo, useEffect, useCallback } from "react";
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
  lockedCategorySlug?: string;
}

export function useMenuFilters({
  menuItems,
  filterData,
  lockedCategorySlug,
}: UseMenuFiltersProps) {
  // Ensure we have valid price range values
  const defaultMinPrice = filterData?.priceRange?.min ?? 100;
  const defaultMaxPrice = filterData?.priceRange?.max ?? 5000;
  // const defaultMaxPrice = 5000;

  // Initialize with locked category if provided
  const defaultCategories = lockedCategorySlug ? [lockedCategorySlug] : [];

  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    categories: parseAsArrayOf(parseAsString).withDefault(defaultCategories), // This will store slugs
    allergens: parseAsArrayOf(parseAsString).withDefault([]),
    minPrice: parseAsInteger.withDefault(defaultMinPrice),
    maxPrice: parseAsInteger.withDefault(defaultMaxPrice),
  });

  // Ensure locked category is always in the categories array
  useEffect(() => {
    if (
      lockedCategorySlug &&
      !filters.categories.includes(lockedCategorySlug)
    ) {
      setFilters({ categories: [lockedCategorySlug, ...filters.categories] });
    }
  }, [lockedCategorySlug, filters.categories, setFilters]);

  // Memoize category mapping for better performance
  const categorySlugToIdMap = useMemo(() => {
    if (!filterData?.categories) return new Map<string, string>();
    return new Map(
      filterData.categories.map((cat) => [cat.slug?.current || "", cat._id])
    );
  }, [filterData?.categories]);

  const categoryIdToSlugMap = useMemo(() => {
    if (!filterData?.categories) return new Map<string, string>();
    return new Map(
      filterData.categories.map((cat) => [cat._id, cat.slug?.current || ""])
    );
  }, [filterData?.categories]);

  // Helper function to convert category slugs to IDs for filtering
  const getCategoryIdsFromSlugs = useCallback(
    (slugs: string[]) => {
      return slugs
        .map((slug) => categorySlugToIdMap.get(slug))
        .filter((id): id is string => !!id);
    },
    [categorySlugToIdMap]
  );

  // Helper function to convert category IDs to slugs for URL
  const getCategorySlugsFromIds = useCallback(
    (ids: string[]) => {
      return ids
        .map((id) => categoryIdToSlugMap.get(id))
        .filter((slug): slug is string => !!slug);
    },
    [categoryIdToSlugMap]
  );

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
  }, [menuItems, filters, getCategoryIdsFromSlugs]);

  const updateSearch = (search: string) => {
    setFilters({ search });
  };

  const updateCategories = (categoryIds: string[]) => {
    // Convert category IDs to slugs for URL
    let categorySlugs = getCategorySlugsFromIds(categoryIds);

    // Ensure locked category is always included if provided
    if (lockedCategorySlug && !categorySlugs.includes(lockedCategorySlug)) {
      categorySlugs = [lockedCategorySlug, ...categorySlugs];
    }

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
      categories: lockedCategorySlug ? [lockedCategorySlug] : [],
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
    lockedCategorySlug,
  };
}
