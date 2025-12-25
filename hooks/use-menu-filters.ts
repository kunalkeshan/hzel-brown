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
  itemsPerPage?: number; // Number of items per page (default: 12 for grid, 10 for list)
}

export function useMenuFilters({
  menuItems,
  filterData,
  lockedCategorySlug,
  itemsPerPage = 12,
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
    page: parseAsInteger.withDefault(1),
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

  // Helper function to convert category slugs to IDs for filtering
  const getCategoryIdsFromSlugs = useCallback((slugs: string[]) => {
    if (!filterData?.categories) return [];
    return filterData.categories
      .filter((category) => slugs.includes(category.slug?.current || ""))
      .map((category) => category._id);
  }, [filterData?.categories]);

  // Helper function to convert category IDs to slugs for URL
  const getCategorySlugsFromIds = useCallback((ids: string[]) => {
    if (!filterData?.categories) return [];
    return filterData.categories
      .filter((category) => ids.includes(category._id))
      .map((category) => category.slug?.current || "")
      .filter((slug) => slug !== "");
  }, [filterData?.categories]);

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
  }, [menuItems, filters.search, filters.categories, filters.allergens, filters.minPrice, filters.maxPrice, getCategoryIdsFromSlugs]);

  // Reset to page 1 when filters change (but not when page changes)
  useEffect(() => {
    if (filters.page !== 1) {
      setFilters({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.categories, filters.allergens, filters.minPrice, filters.maxPrice]);

  // Calculate pagination data
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentPage = Math.min(filters.page, totalPages || 1); // Ensure page doesn't exceed total pages

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get items for current page
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

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
      page: 1,
    });
  };

  const updatePage = (page: number) => {
    setFilters({ page });
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
    paginatedItems,
    updateSearch,
    updateCategories,
    updateAllergens,
    updatePriceRange,
    updatePage,
    clearFilters,
    hasActiveFilters,
    totalItems: menuItems.length,
    filteredCount: filteredItems.length,
    lockedCategorySlug,
    // Pagination data
    pagination: {
      currentPage,
      totalPages,
      itemsPerPage,
      startIndex: startIndex + 1, // 1-indexed for display
      endIndex: Math.min(endIndex, filteredItems.length), // Don't exceed filtered count
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}
