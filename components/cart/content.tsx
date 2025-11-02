"use client";

import { useCart } from "@/hooks/use-cart";
import { EmptyState } from "./empty-state";
import { ItemsList } from "./items-list";
import { OrderSummary } from "./order-summary";

export function Content() {
  const { isEmpty } = useCart();

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState />
      </div>
    );
  }

  return (
    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <ItemsList />
      <OrderSummary />
    </form>
  );
}

