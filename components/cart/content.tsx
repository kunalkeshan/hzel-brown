"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/hooks/use-cart";
import { EmptyState } from "./empty-state";
import { ItemsList } from "./items-list";
import { OrderSummary } from "./order-summary";

type ContentProps = {
  phoneNumber: string | null;
};

export function Content({ phoneNumber }: ContentProps) {
  const { isEmpty } = useCart();

  return (
    <AnimatePresence mode="wait">
      {isEmpty ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="mx-auto max-w-2xl"
        >
          <EmptyState />
        </motion.div>
      ) : (
        <motion.form
          key="items"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <ItemsList />
          <OrderSummary phoneNumber={phoneNumber} />
        </motion.form>
      )}
    </AnimatePresence>
  );
}
