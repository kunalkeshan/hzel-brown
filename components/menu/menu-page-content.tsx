"use client";

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
}

export function MenuPageContent({
  menuItems,
  filterData,
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
  } = useMenuFilters({
    menuItems: menuItems || [],
    filterData,
  });

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
      <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
        <MenuGrid
          items={filteredItems}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}
