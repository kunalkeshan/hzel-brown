"use client";

import { useMemo, useEffect, useCallback, useState } from "react";
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

  // Draft state — mirrors categories/allergens/price but is not immediately applied.
  // Initialized from committed nuqs state (URL) on mount.
  const [draftFilters, setDraftFilters] = useState(() => {
    let categories = filters.categories;
    // Ensure locked category is always in the initial draft
    if (lockedCategorySlug && !categories.includes(lockedCategorySlug)) {
      categories = [lockedCategorySlug, ...categories];
    }
    return {
      categories, // slugs
      allergens: filters.allergens,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    };
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

  // Category/allergen/price handlers update draft state only — no immediate re-filtering.
  const updateCategories = (categoryIds: string[]) => {
    // Convert category IDs to slugs for draft storage
    let categorySlugs = getCategorySlugsFromIds(categoryIds);

    // Ensure locked category is always included if provided
    if (lockedCategorySlug && !categorySlugs.includes(lockedCategorySlug)) {
      categorySlugs = [lockedCategorySlug, ...categorySlugs];
    }

    setDraftFilters((prev) => ({ ...prev, categories: categorySlugs }));
  };

  const updateAllergens = (allergens: string[]) => {
    setDraftFilters((prev) => ({ ...prev, allergens }));
  };

  const updatePriceRange = (minPrice: number, maxPrice: number) => {
    setDraftFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  // Commits draft state to nuqs URL state, triggering a re-filter.
  const commitFilters = useCallback(() => {
    setFilters({
      categories: draftFilters.categories,
      allergens: draftFilters.allergens,
      minPrice: draftFilters.minPrice,
      maxPrice: draftFilters.maxPrice,
    });
  }, [draftFilters, setFilters]);

  const clearFilters = () => {
    const resetState = {
      categories: lockedCategorySlug ? [lockedCategorySlug] : [],
      allergens: [],
      minPrice: defaultMinPrice,
      maxPrice: defaultMaxPrice,
    };
    setDraftFilters(resetState);
    setFilters({
      search: "",
      ...resetState,
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

  // Count filter dimensions where draft differs from committed state.
  // Used to show a badge on the "Apply Filters" button and mobile trigger.
  const pendingFilterCount = useMemo(() => {
    let count = 0;
    const committedCatSet = new Set(filters.categories);
    if (
      draftFilters.categories.length !== filters.categories.length ||
      !draftFilters.categories.every((c) => committedCatSet.has(c))
    ) {
      count++;
    }
    const committedAllergenSet = new Set(filters.allergens);
    if (
      draftFilters.allergens.length !== filters.allergens.length ||
      !draftFilters.allergens.every((a) => committedAllergenSet.has(a))
    ) {
      count++;
    }
    if (
      draftFilters.minPrice !== filters.minPrice ||
      draftFilters.maxPrice !== filters.maxPrice
    ) {
      count++;
    }
    return count;
  }, [draftFilters, filters.categories, filters.allergens, filters.minPrice, filters.maxPrice]);

  // Convert current URL slugs back to IDs for the filter components
  const selectedCategoryIds = getCategoryIdsFromSlugs(filters.categories);
  // Convert draft slugs to IDs for the filter components
  const draftCategoryIds = getCategoryIdsFromSlugs(draftFilters.categories);

  return {
    filters: {
      ...filters,
      categories: selectedCategoryIds, // Return IDs for filter components
    },
    draftFilters: {
      ...draftFilters,
      categories: draftCategoryIds, // Return IDs for filter components
    },
    filteredItems,
    paginatedItems,
    updateSearch,
    updateCategories,
    updateAllergens,
    updatePriceRange,
    updatePage,
    commitFilters,
    clearFilters,
    hasActiveFilters,
    pendingFilterCount,
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
