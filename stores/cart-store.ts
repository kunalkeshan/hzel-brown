import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartState,
  CartItem,
  MenuItem,
  CheckoutValidationResult,
  CartErrorType,
} from "@/types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Core operations
      addItem: (item: MenuItem): boolean => {
        const state = get();

        // Check availability first
        if (!state.isItemAvailable(item)) {
          console.warn(`Cannot add unavailable item: ${item.name}`);
          return false;
        }

        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          (cartItem) => cartItem._id === item._id
        );

        if (existingItemIndex >= 0) {
          // Item exists, increment quantity
          return state.incrementQuantity(item._id);
        } else {
          // Add new item to cart
          const newCartItem: CartItem = {
            ...item,
            quantity: 1,
            addedAt: new Date().toISOString(),
          };

          set((state) => ({
            items: [...state.items, newCartItem],
          }));

          console.log(`Added ${item.name} to cart`);
          return true;
        }
      },

      incrementQuantity: (itemId: string): boolean => {
        const state = get();
        const item = state.items.find((item) => item._id === itemId);

        if (!item) {
          console.warn(`Item with ID ${itemId} not found in cart`);
          return false;
        }

        // Check availability before incrementing
        if (!state.isItemAvailable(item)) {
          console.warn(`Cannot increment unavailable item: ${item.name}`);
          return false;
        }

        set((state) => ({
          items: state.items.map((cartItem) =>
            cartItem._id === itemId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        }));

        console.log(
          `Incremented ${item.name} quantity to ${item.quantity + 1}`
        );
        return true;
      },

      decrementQuantity: (itemId: string): boolean => {
        const state = get();
        const item = state.items.find((item) => item._id === itemId);

        if (!item) {
          console.warn(`Item with ID ${itemId} not found in cart`);
          return false;
        }

        if (item.quantity <= 1) {
          // Remove item if quantity would become 0
          state.removeItem(itemId);
          return true;
        }

        set((state) => ({
          items: state.items.map((cartItem) =>
            cartItem._id === itemId
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          ),
        }));

        console.log(
          `Decremented ${item.name} quantity to ${item.quantity - 1}`
        );
        return true;
      },

      removeItem: (itemId: string): void => {
        const state = get();
        const item = state.items.find((item) => item._id === itemId);

        set((state) => ({
          items: state.items.filter((item) => item._id !== itemId),
        }));

        if (item) {
          console.log(`Removed ${item.name} from cart`);
        }
      },

      clearCart: (): void => {
        set({ items: [] });
        console.log("Cart cleared");
      },

      // Getters
      getItemQuantity: (itemId: string): number => {
        const item = get().items.find((item) => item._id === itemId);
        return item?.quantity || 0;
      },

      getTotalItems: (): number => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalCost: (): number => {
        return get().items.reduce((total, item) => {
          const price = item.price || 0;
          return total + price * item.quantity;
        }, 0);
      },

      // Validation
      isItemAvailable: (item: MenuItem): boolean => {
        // Check if item is available
        if (item.isAvailable === false) {
          return false;
        }

        // Check if item has a valid price
        if (typeof item.price !== "number" || item.price <= 0) {
          return false;
        }

        // For combo items, check if they have valid combo description
        if (item.isCombo && !item.comboDescription) {
          console.warn(`Combo item ${item.name} missing combo description`);
        }

        return true;
      },

      // Checkout validation
      validateAndCheckout: (): CheckoutValidationResult => {
        const state = get();
        const unavailableItems: CartItem[] = [];
        const validItems: CartItem[] = [];

        // Validate each item in the cart
        state.items.forEach((item) => {
          if (state.isItemAvailable(item)) {
            validItems.push(item);
          } else {
            unavailableItems.push(item);
          }
        });

        const totalCost = validItems.reduce((total, item) => {
          const price = item.price || 0;
          return total + price * item.quantity;
        }, 0);

        const totalItems = validItems.reduce(
          (total, item) => total + item.quantity,
          0
        );

        const result: CheckoutValidationResult = {
          isValid: unavailableItems.length === 0 && validItems.length > 0,
          unavailableItems,
          validItems,
          totalCost,
          totalItems,
        };

        // Console log the cart for now
        console.log("=== CHECKOUT VALIDATION ===");
        console.log("Cart Contents:", state.items);
        console.log("Validation Result:", result);
        console.log("Valid Items:", validItems);
        console.log("Unavailable Items:", unavailableItems);
        console.log("Total Cost:", totalCost);
        console.log("Total Items:", totalItems);
        console.log("Is Valid for Checkout:", result.isValid);
        console.log("===========================");

        return result;
      },
    }),
    {
      name: "hzel-brown-cart", // Unique name for sessionStorage key
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
