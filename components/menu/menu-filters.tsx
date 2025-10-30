"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { MENU_FILTERS_DATA_QUERYResult } from "@/types/cms";

// Helper function to get allergen display labels
function getAllergenLabel(allergen: string): string {
  const allergenLabels: Record<string, string> = {
    gluten: "Gluten",
    dairy: "Dairy",
    nuts: "Nuts",
    eggs: "Eggs",
    soy: "Soy",
    sesame: "Sesame",
  };
  return allergenLabels[allergen] || allergen;
}

interface MenuFiltersProps {
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
}

export function MenuFilters({
  filterData,
  filters,
  onSearchChange,
  onCategoriesChange,
  onAllergensChange,
  onPriceRangeChange,
  onClearFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
}: MenuFiltersProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      onCategoriesChange([...filters.categories, categoryId]);
    } else {
      onCategoriesChange(filters.categories.filter((id) => id !== categoryId));
    }
  };

  const handleAllergenChange = (allergen: string, checked: boolean) => {
    if (checked) {
      onAllergensChange([...filters.allergens, allergen]);
    } else {
      onAllergensChange(filters.allergens.filter((a) => a !== allergen));
    }
  };

  const handlePriceChange = (values: number[]) => {
    onPriceRangeChange(values[0], values[1]);
  };

  const minPrice = filterData?.priceRange?.min ?? 100;
  const maxPrice = filterData?.priceRange?.max ?? 5000;

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">Search Menu</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for items..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {filters.search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredCount} of {totalCount} items
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-2 h-auto p-0 text-primary hover:text-primary/80"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Categories */}
      {filterData?.categories && filterData.categories.length > 0 && (
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-900">
            Categories
          </Label>
          <div className="space-y-3">
            {filterData.categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-3">
                <Checkbox
                  id={`category-${category._id}`}
                  checked={filters.categories.includes(category._id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category._id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`category-${category._id}`}
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  {category.title}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allergens */}
      {filterData?.allergens && filterData.allergens.length > 0 && (
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-900">
            Exclude Allergens
          </Label>
          <div className="space-y-3">
            {filterData.allergens
              .filter((allergen): allergen is string => allergen !== null)
              .map((allergen) => (
                <div key={allergen} className="flex items-center space-x-3">
                  <Checkbox
                    id={`allergen-${allergen}`}
                    checked={filters.allergens.includes(allergen)}
                    onCheckedChange={(checked) =>
                      handleAllergenChange(allergen, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`allergen-${allergen}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {getAllergenLabel(allergen)}
                  </Label>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-900">Price Range</Label>
        <div className="space-y-4">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            min={minPrice}
            max={maxPrice}
            step={50}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>₹{filters.minPrice}</span>
            <span>₹{filters.maxPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
