import type { WithContext, Product } from "schema-dts";
import type { MENU_ITEM_BY_SLUGS_QUERYResult } from "@/types/cms";
import { createAbsoluteUrl, formatPrice, getAvailability } from "./utils";

interface ProductSchemaProps {
  item: NonNullable<MENU_ITEM_BY_SLUGS_QUERYResult>["item"];
  baseUrl: string;
  organizationName: string;
  /**
   * The absolute URL of the product image
   */
  imageUrl?: string;
  /**
   * The canonical URL of the product page
   */
  productUrl: string;
}

/**
 * Generates Product schema for menu items (bakery products)
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */
export function generateProductSchema({
  item,
  baseUrl,
  organizationName,
  imageUrl,
  productUrl,
}: ProductSchemaProps): WithContext<Product> {
  if (!item) {
    throw new Error("Menu item is required to generate product schema");
  }

  // Build category string from item categories
  const categoryString =
    item.categories && item.categories.length > 0
      ? item.categories.map((cat) => cat.title).join(", ")
      : "Bakery Products";

  // Build additional properties for allergens and ingredients
  const additionalProperty: Array<{
    "@type": "PropertyValue";
    name: string;
    value: string;
  }> = [];

  // Add allergens if available
  if (item.allergens && item.allergens.length > 0) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Allergens",
      value: item.allergens.join(", "),
    });
  }

  // Add ingredients if available
  if (item.ingredients && item.ingredients.length > 0) {
    const ingredientNames = item.ingredients
      .map((ing) => ing.name)
      .filter(Boolean)
      .join(", ");
    if (ingredientNames) {
      additionalProperty.push({
        "@type": "PropertyValue",
        name: "Ingredients",
        value: ingredientNames,
      });
    }
  }

  // Add combo info if applicable
  if (item.isCombo && item.comboDescription) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Combo Details",
      value: item.comboDescription,
    });
  }

  const schema: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name || "Bakery Product",
    description:
      item.description ||
      "Freshly baked artisan product crafted with premium ingredients",
    ...(imageUrl && { image: imageUrl }),
    url: productUrl,
    category: categoryString,
    ...(additionalProperty.length > 0 && { additionalProperty }),
    // Offers section with price and availability
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: item.price ? formatPrice(item.price) : undefined,
      availability: getAvailability(item.isAvailable),
      seller: {
        "@type": "Organization",
        name: organizationName,
      },
    },
    // TODO: Add aggregateRating when review system is implemented
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: "4.5",
    //   reviewCount: "24"
    // }
  };

  return schema;
}
