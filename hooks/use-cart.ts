import { useCartStore } from "@/stores/cart-store";
import type {
  MenuItem,
  CartItem,
  CheckoutValidationResult,
} from "@/types/cart";
import { formatCurrency } from "@/lib/numbers";

/**
 * Custom hook that provides a clean interface to the cart store
 * This hook wraps the Zustand store and provides additional utilities
 */
export function useCart() {
  // Get all store methods and state
  const store = useCartStore();

  return {
    // State
    items: store.items,

    // Computed values
    totalItems: store.getTotalItems(),
    totalCost: store.getTotalCost(),
    isEmpty: store.items.length === 0,

    // Core operations
    addItem: store.addItem,
    incrementQuantity: store.incrementQuantity,
    decrementQuantity: store.decrementQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,

    // Utilities
    getItemQuantity: store.getItemQuantity,
    isItemInCart: (itemId: string): boolean =>
      store.getItemQuantity(itemId) > 0,
    isItemAvailable: store.isItemAvailable,

    // Checkout
    validateAndCheckout: store.validateAndCheckout,

    // Helper methods for UI
    getCartSummary: () => ({
      totalItems: store.getTotalItems(),
      totalCost: store.getTotalCost(),
      itemCount: store.items.length,
      isEmpty: store.items.length === 0,
    }),

    // Format currency for display
    formatPrice: (price: number): string => {
      return formatCurrency(price);
    },

    // Get formatted total cost
    getFormattedTotal: (): string => {
      const total = store.getTotalCost();
      return formatCurrency(total);
    },
  };
}

// Export the store directly for advanced usage
export { useCartStore };

// Export types for convenience
export type { MenuItem, CartItem, CheckoutValidationResult };
