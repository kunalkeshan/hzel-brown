"use client";

import { MenuItemListCard } from "./menu-item-list-card";
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

interface MenuListProps {
  items: MenuItem[];
  isLoading?: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function MenuList({
  items,
  isLoading = false,
  hasActiveFilters,
  onClearFilters,
}: MenuListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 md:gap-6 py-6 border-b border-gray-200">
            {/* Image skeleton */}
            <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex-shrink-0" />

            {/* Content skeleton */}
            <div className="flex-1 flex flex-col md:flex-row md:justify-between gap-2 md:gap-6">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full hidden md:block" />
              </div>
              <div className="flex items-center md:flex-col gap-2 md:items-end">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-32" />
              </div>
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
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-0"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <MenuItemListCard key={item._id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
