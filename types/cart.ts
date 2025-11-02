import type { MENU_ITEMS_QUERYResult } from "./cms";

// Extract the MenuItem type from the query result
export type MenuItem = MENU_ITEMS_QUERYResult[0];

// Cart item extends MenuItem with quantity
export interface CartItem extends MenuItem {
  quantity: number;
  addedAt: string; // ISO timestamp for when item was added
}

// Cart store state interface
export interface CartState {
  items: CartItem[];

  // Core operations
  addItem: (item: MenuItem) => boolean; // Returns success status
  incrementQuantity: (itemId: string) => boolean;
  decrementQuantity: (itemId: string) => boolean;
  removeItem: (itemId: string) => void;
  clearCart: () => void;

  // Getters
  getItemQuantity: (itemId: string) => number;
  getTotalItems: () => number;
  getTotalCost: () => number;

  // Validation
  isItemAvailable: (item: MenuItem) => boolean;

  // Checkout
  validateAndCheckout: () => CheckoutValidationResult;
}

// Checkout validation result
export interface CheckoutValidationResult {
  isValid: boolean;
  unavailableItems: CartItem[];
  validItems: CartItem[];
  totalCost: number;
  totalItems: number;
}

// Error types for cart operations
export enum CartErrorType {
  ITEM_UNAVAILABLE = "ITEM_UNAVAILABLE",
  ITEM_NOT_FOUND = "ITEM_NOT_FOUND",
  INVALID_QUANTITY = "INVALID_QUANTITY",
  MISSING_PRICE = "MISSING_PRICE",
}

export interface CartError {
  type: CartErrorType;
  message: string;
  itemId?: string;
}
