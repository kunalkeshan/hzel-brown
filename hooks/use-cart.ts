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
  
  // Use Zustand selectors for better performance
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalCost = useCartStore((state) => state.getTotalCost());
  const isEmpty = items.length === 0;

  return {
    // State
    items,

    // Computed values
    totalItems,
    totalCost,
    isEmpty,

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
      totalItems,
      totalCost,
      itemCount: items.length,
      isEmpty,
    }),

    // Format currency for display
    formatPrice: (price: number): string => {
      return formatCurrency(price);
    },

    // Get formatted total cost
    getFormattedTotal: (): string => {
      return formatCurrency(totalCost);
    },
  };
}

// Export the store directly for advanced usage
export { useCartStore };

// Export types for convenience
export type { MenuItem, CartItem, CheckoutValidationResult };
