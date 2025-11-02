"use client";

import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import type { MENU_ITEM_BY_SLUGS_QUERYResult } from "@/types/cms";

type MenuItemType = NonNullable<MENU_ITEM_BY_SLUGS_QUERYResult["item"]>;

interface MenuItemDisplayActionsProps {
  item: MenuItemType;
}

export function MenuItemDisplayActions({ item }: MenuItemDisplayActionsProps) {
  const router = useRouter();
  const {
    isItemInCart,
    getItemQuantity,
    addItem,
    incrementQuantity,
    decrementQuantity,
    removeItem,
  } = useCart();

  const isInCart = isItemInCart(item._id);
  const quantity = getItemQuantity(item._id);

  const handleAddToCart = () => {
    addItem(item);
  };

  const handleIncrement = () => {
    incrementQuantity(item._id);
  };

  const handleDecrement = () => {
    decrementQuantity(item._id);
  };

  const handleRemove = () => {
    removeItem(item._id);
  };

  const handleCheckout = () => {
    router.push("/cart");
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isInCart ? (
          <motion.div
            key="add-to-cart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full sm:w-auto"
              disabled={!item.isAvailable}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            {!item.isAvailable && (
              <p className="mt-2 text-sm text-destructive">
                Currently unavailable
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="quantity-controls"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-12 text-center text-lg font-semibold">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                className="h-10 w-10"
                disabled={!item.isAvailable}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRemove}
                className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Remove item from cart"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleCheckout}
              size="lg"
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="h-5 w-5" />
              Go to Checkout
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
