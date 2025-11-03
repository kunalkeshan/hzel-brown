import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartState,
  CartItem,
  MenuItem,
  CheckoutValidationResult,
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

          return true;
        }
      },

      incrementQuantity: (itemId: string): boolean => {
        const state = get();
        const item = state.items.find((item) => item._id === itemId);

        if (!item) {
          return false;
        }

        // Check availability before incrementing
        if (!state.isItemAvailable(item)) {
          return false;
        }

        set((state) => ({
          items: state.items.map((cartItem) =>
            cartItem._id === itemId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        }));

        return true;
      },

      decrementQuantity: (itemId: string): boolean => {
        const state = get();
        const item = state.items.find((item) => item._id === itemId);

        if (!item) {
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

        return true;
      },

      removeItem: (itemId: string): void => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== itemId),
        }));
      },

      clearCart: (): void => {
        set({ items: [] });
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
