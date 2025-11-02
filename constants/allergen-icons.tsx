import { Wheat, Milk, Nut, Egg, Bean, Sprout, LucideIcon } from "lucide-react";

export interface AllergenIconInfo {
  icon: LucideIcon;
  label: string;
}

/**
 * Mapping of allergen values to their corresponding icons and labels
 * Matches the allergen values defined in sanity/schemaTypes/menuItemType.ts
 */
export const ALLERGEN_ICONS: Record<string, AllergenIconInfo> = {
  gluten: {
    icon: Wheat,
    label: "Gluten",
  },
  dairy: {
    icon: Milk,
    label: "Dairy",
  },
  nuts: {
    icon: Nut,
    label: "Nuts",
  },
  eggs: {
    icon: Egg,
    label: "Eggs",
  },
  soy: {
    icon: Bean,
    label: "Soy",
  },
  sesame: {
    icon: Sprout,
    label: "Sesame",
  },
};

/**
 * Get allergen icon information by allergen value
 * Returns undefined if allergen is not recognized
 */
export function getAllergenIcon(
  allergen: string
): AllergenIconInfo | undefined {
  return ALLERGEN_ICONS[allergen.toLowerCase()];
}
