"use client";

import { HelpCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { formatCurrency } from "@/lib/numbers";

export function OrderSummary() {
  const { totalCost, formatPrice, validateAndCheckout } = useCart();

  const handleCheckout = () => {
    const validation = validateAndCheckout();
    if (validation.isValid) {
      // TODO: Navigate to checkout page or handle checkout
      console.log("Proceeding to checkout with:", validation);
    }
  };

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-muted px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-foreground">
        Order summary
      </h2>
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-muted-foreground">Subtotal</dt>
          <dd className="text-sm font-medium text-foreground">
            <AnimatedNumber value={totalCost} formatValue={formatCurrency} />
          </dd>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <dt className="flex items-center text-sm text-muted-foreground">
            <span>Shipping estimate</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">Learn more about shipping</span>
                  <HelpCircle aria-hidden="true" className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Shipping details will be shared just before order dispatch
                </p>
              </TooltipContent>
            </Tooltip>
          </dt>
          <dd className="text-sm font-medium text-foreground">TBD</dd>
        </div>

        {/* Tax Estimate - Commented out but kept for future use */}
        {/* <div className="flex items-center justify-between border-t border-border pt-4">
          <dt className="flex text-sm text-muted-foreground">
            <span>Tax estimate</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">Learn more about tax</span>
                  <HelpCircle aria-hidden="true" className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Tax will be calculated based on your location and order
                  details
                </p>
              </TooltipContent>
            </Tooltip>
          </dt>
          <dd className="text-sm font-medium text-foreground">
            {formatPrice(0)}
          </dd>
        </div> */}

        <div className="flex items-center justify-between border-t border-border pt-4">
          <dt className="text-base font-medium text-foreground">Order total</dt>
          <dd className="text-base font-medium text-foreground">
            <AnimatedNumber value={totalCost} formatValue={formatCurrency} />
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button
          type="button"
          onClick={handleCheckout}
          size="lg"
          className="w-full"
        >
          Checkout
        </Button>
      </div>
    </section>
  );
}
