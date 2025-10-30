"use client";

import { MenuItemCard } from "./menu-item-card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ALL_MENU_ITEMS_QUERYResult } from "@/types/cms";

type MenuItem = NonNullable<ALL_MENU_ITEMS_QUERYResult>[number];

interface MenuGridProps {
  items: MenuItem[];
  isLoading?: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function MenuGrid({
  items,
  isLoading = false,
  hasActiveFilters,
  onClearFilters,
}: MenuGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Empty className="border border-dashed border-border py-16">
        <EmptyHeader>
          <EmptyTitle>
            {hasActiveFilters
              ? "No items match your filters"
              : "No menu items available"}
          </EmptyTitle>
          <EmptyDescription>
            {hasActiveFilters
              ? "Try adjusting your search criteria or clearing some filters to see more results."
              : "We're currently updating our menu. Please check back soon for delicious options."}
          </EmptyDescription>
        </EmptyHeader>
        {hasActiveFilters && (
          <EmptyContent>
            <Button onClick={onClearFilters} variant="outline">
              Clear all filters
            </Button>
          </EmptyContent>
        )}
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItemCard key={item._id} item={item} className="mx-auto sm:mx-0" />
      ))}
    </div>
  );
}
