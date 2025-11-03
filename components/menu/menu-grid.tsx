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
import { AnimatePresence, motion } from "motion/react";
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

  return (
    <AnimatePresence mode="wait">
      {items.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
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
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <MenuItemCard
                key={item._id}
                item={item}
                className="mx-auto sm:mx-0"
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
