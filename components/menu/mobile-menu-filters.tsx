"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuFilters } from "./menu-filters";
import type { MENU_FILTERS_DATA_QUERYResult } from "@/types/cms";

interface MobileMenuFiltersProps {
  filterData: MENU_FILTERS_DATA_QUERYResult;
  filters: {
    search: string;
    categories: string[];
    allergens: string[];
    minPrice: number;
    maxPrice: number;
  };
  onSearchChange: (search: string) => void;
  onCategoriesChange: (categories: string[]) => void;
  onAllergensChange: (allergens: string[]) => void;
  onPriceRangeChange: (minPrice: number, maxPrice: number) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  lockedCategorySlug?: string;
}

export function MobileMenuFilters(props: MobileMenuFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-2 lg:hidden"
        >
          <Filter className="h-4 w-4" />
          Filters
          {props.hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {props.filters.categories.length +
                props.filters.allergens.length +
                (props.filters.search ? 1 : 0) +
                (props.filters.minPrice !==
                  (props.filterData?.priceRange?.min ?? 100) ||
                props.filters.maxPrice !==
                  (props.filterData?.priceRange?.max ?? 5000)
                  ? 1
                  : 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:max-w-sm overflow-y-auto px-8"
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <MenuFilters {...props} />
        </div>
        <div className="mt-6 py-4 border-t">
          <Button onClick={() => setIsOpen(false)} className="w-full">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
