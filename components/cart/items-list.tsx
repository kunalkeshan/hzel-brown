"use client";

import { AnimatePresence } from "motion/react";
import { useCart } from "@/hooks/use-cart";
import { ItemRow } from "./item-row";

export function ItemsList() {
  const { items } = useCart();

  return (
    <section aria-labelledby="cart-heading" className="lg:col-span-7">
      <h2 id="cart-heading" className="sr-only">
        Items in your shopping cart
      </h2>
      <ul
        role="list"
        className="divide-y divide-border border-t border-b border-border"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <ItemRow key={item._id} item={item} />
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

