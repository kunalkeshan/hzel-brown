"use client";

import { CategoryCard } from "./category-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import type { ALL_CATEGORIES_QUERYResult } from "@/types/cms";
import { cn } from "@/lib/utils";

interface CategoryCardsGridProps {
  categories: ALL_CATEGORIES_QUERYResult;
  gridClassName?: string;
  animationDelay?: number;
  animationDuration?: number;
  animationY?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function CategoryCardsGrid({
  categories,
  gridClassName = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
  animationDelay = 0.1,
  animationDuration = 0.6,
  animationY = 20,
  emptyTitle = "No categories available",
  emptyDescription = "Categories will appear here once they are added to the menu.",
}: CategoryCardsGridProps) {
  if (!categories || categories.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className={cn(gridClassName)}>
      {categories.map((category, index) => (
        <CategoryCard
          key={category._id}
          category={category}
          index={index}
          animationDelay={animationDelay}
          animationDuration={animationDuration}
          animationY={animationY}
        />
      ))}
    </div>
  );
}

