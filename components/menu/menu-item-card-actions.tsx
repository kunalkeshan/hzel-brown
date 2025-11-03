"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import type {
  ALL_MENU_ITEMS_QUERYResult,
  SITE_CONFIG_QUERYResult,
} from "@/types/cms";

type MenuItemType =
  | NonNullable<ALL_MENU_ITEMS_QUERYResult>[number]
  | NonNullable<
      NonNullable<SITE_CONFIG_QUERYResult>["featuredMenuItems"]
    >[number];

interface MenuItemCardActionsProps {
  item: MenuItemType;
}

export function MenuItemCardActions({ item }: MenuItemCardActionsProps) {
  const [mounted, setMounted] = useState(false);
  const {
    isItemInCart,
    getItemQuantity,
    addItem,
    incrementQuantity,
    decrementQuantity,
    removeItem,
  } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isInCart = mounted ? isItemInCart(item._id) : false;
  const quantity = mounted ? getItemQuantity(item._id) : 0;

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

  return (
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
            size="sm"
            className="w-full"
            disabled={!item.isAvailable}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="quantity-controls"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center gap-2"
        >
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleDecrement}
            className="h-8 w-8"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="min-w-8 text-center text-sm font-semibold">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleIncrement}
            className="h-8 w-8"
            disabled={!item.isAvailable}
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleRemove}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label="Remove item from cart"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
