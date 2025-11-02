/**
 * Common accordion items for menu item detail pages
 * These are displayed alongside item-specific details like ingredients and allergens
 */

export interface MenuAccordionItem {
  name: string;
  items: string[];
  isText?: boolean;
}

/**
 * Shipping information accordion data
 * Tailored for Tamil Nadu baked goods delivery
 */
export const SHIPPING_ACCORDION: MenuAccordionItem = {
  name: "Shipping",
  items: [
    "Free shipping on orders over ₹3,000",
    "Standard delivery within 2-3 business days across Tamil Nadu",
    "Express delivery available for urgent orders",
    "Carefully packed in food-safe containers to maintain freshness",
  ],
};

/**
 * Returns and cancellation policy accordion data
 * Appropriate for perishable baked goods
 */
export const RETURNS_ACCORDION: MenuAccordionItem = {
  name: "Returns",
  items: [
    "Order cancellation available before dispatch (full refund)",
    "Quality or damage issues handled case-by-case (replacement or refund)",
    "Orders cannot be returned once delivered due to perishable nature",
  ],
};

/**
 * All common accordions that should be displayed on every menu item page
 */
export const COMMON_MENU_ACCORDIONS: MenuAccordionItem[] = [
  SHIPPING_ACCORDION,
  RETURNS_ACCORDION,
];
