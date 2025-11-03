"use client";

import { useEffect, useRef } from "react";
import { useMenuFilters } from "@/hooks/use-menu-filters";
import { MenuFilters } from "./menu-filters";
import { MobileMenuFilters } from "./mobile-menu-filters";
import { MenuGrid } from "./menu-grid";
import type {
  ALL_MENU_ITEMS_QUERYResult,
  MENU_FILTERS_DATA_QUERYResult,
} from "@/types/cms";

interface MenuPageContentProps {
  menuItems: NonNullable<ALL_MENU_ITEMS_QUERYResult>;
  filterData: NonNullable<MENU_FILTERS_DATA_QUERYResult>;
  lockedCategorySlug?: string;
}

export function MenuPageContent({
  menuItems,
  filterData,
  lockedCategorySlug,
}: MenuPageContentProps) {
  const {
    filters,
    filteredItems,
    updateSearch,
    updateCategories,
    updateAllergens,
    updatePriceRange,
    clearFilters,
    hasActiveFilters,
    totalItems,
    filteredCount,
    lockedCategorySlug: hookLockedCategorySlug,
  } = useMenuFilters({
    menuItems: menuItems || [],
    filterData,
    lockedCategorySlug,
  });

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const previousItemsCount = useRef<number>(filteredItems.length);

  // Simplified scroll position preservation - only when items significantly decrease
  useEffect(() => {
    const itemsDecreased = filteredItems.length < previousItemsCount.current * 0.5;
    
    if (itemsDecreased) {
      // Only adjust if content significantly decreased
      const currentScrollY = window.scrollY || window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScrollY = documentHeight - viewportHeight;

      if (currentScrollY > maxScrollY) {
        window.scrollTo({
          top: Math.max(0, maxScrollY),
          behavior: "smooth",
        });
      }
    }

    previousItemsCount.current = filteredItems.length;
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

      {/* Product grid */}
      <div
        ref={gridContainerRef}
        className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
      >
        <MenuGrid
          items={filteredItems}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}
