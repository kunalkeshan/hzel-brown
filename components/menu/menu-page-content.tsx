"use client";

import { useEffect, useRef } from "react";
import { useMenuFilters } from "@/hooks/use-menu-filters";
import { MenuFilters } from "./menu-filters";
import { MobileMenuFilters } from "./mobile-menu-filters";
import { MenuList } from "./menu-list";
import { MenuGrid } from "./menu-grid";
import { MenuPagination } from "./menu-pagination";
import type {
  ALL_MENU_ITEMS_QUERYResult,
  MENU_FILTERS_DATA_QUERYResult,
} from "@/types/cms";

interface MenuPageContentProps {
  menuItems: NonNullable<ALL_MENU_ITEMS_QUERYResult>;
  filterData: NonNullable<MENU_FILTERS_DATA_QUERYResult>;
  lockedCategorySlug?: string;
  useGridLayout?: boolean;
}

export function MenuPageContent({
  menuItems,
  filterData,
  lockedCategorySlug,
  useGridLayout = true,
}: MenuPageContentProps) {
  // Use different items per page based on layout
  const itemsPerPage = useGridLayout ? 12 : 10;

  const {
    filters,
    filteredItems,
    paginatedItems,
    updateSearch,
    updateCategories,
    updateAllergens,
    updatePriceRange,
    updatePage,
    clearFilters,
    hasActiveFilters,
    totalItems,
    filteredCount,
    lockedCategorySlug: hookLockedCategorySlug,
    pagination,
  } = useMenuFilters({
    menuItems: menuItems || [],
    filterData,
    lockedCategorySlug,
    itemsPerPage,
  });

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollY = useRef<number>(0);
  const previousItemsCount = useRef<number>(filteredItems.length);
  const previousContainerHeight = useRef<number>(0);

  // Preserve scroll position when items change
  useEffect(() => {
    // Only adjust scroll if items count decreased
    if (
      filteredItems.length < previousItemsCount.current &&
      gridContainerRef.current
    ) {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const containerHeight = gridContainerRef.current.scrollHeight;
      const previousHeight = previousContainerHeight.current;

      // Only adjust if we're scrolled down and content height decreased
      if (previousHeight > 0 && containerHeight < previousHeight) {
        const heightDifference = previousHeight - containerHeight;

        // If we're scrolled past where the content now ends, adjust smoothly
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const maxScrollY = documentHeight - viewportHeight;

        if (
          currentScrollY > 0 &&
          currentScrollY > maxScrollY - heightDifference
        ) {
          // Smoothly scroll to maintain visual context
          const targetScroll = Math.max(
            0,
            currentScrollY - heightDifference * 0.5
          );

          window.scrollTo({
            top: targetScroll,
            behavior: "smooth",
          });
        }
      }
    }

    // Update refs after a brief delay to let layout settle
    const timeoutId = setTimeout(() => {
      previousScrollY.current = window.scrollY || window.pageYOffset;
      previousItemsCount.current = filteredItems.length;
      if (gridContainerRef.current) {
        previousContainerHeight.current = gridContainerRef.current.scrollHeight;
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [filteredItems.length]);

  const filterProps = {
    filterData,
    filters,
    onSearchChange: updateSearch,
    onCategoriesChange: updateCategories,
    onAllergensChange: updateAllergens,
    onPriceRangeChange: updatePriceRange,
    onClearFilters: clearFilters,
    hasActiveFilters,
    filteredCount,
    totalCount: totalItems,
    lockedCategorySlug: hookLockedCategorySlug,
  };

  return (
    <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4 container">
      <aside>
        <h2 className="sr-only">Filters</h2>

        {/* Mobile filter button */}
        <MobileMenuFilters {...filterProps} />

        {/* Desktop filters */}
        <div className="hidden lg:block h-fit sticky top-32">
          <MenuFilters {...filterProps} />
        </div>
      </aside>

      {/* Menu display */}
      <div
        ref={gridContainerRef}
        data-menu-section
        className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
      >
        {useGridLayout ? (
          <MenuGrid
            items={paginatedItems}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <MenuList
            items={paginatedItems}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        )}

        {/* Pagination */}
        <MenuPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={updatePage}
        />
      </div>
    </div>
  );
}
