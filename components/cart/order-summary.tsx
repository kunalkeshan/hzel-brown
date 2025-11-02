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
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSocialIcon } from "@/constants/navigation";

type OrderSummaryProps = {
  phoneNumber: string | null;
};

export function OrderSummary({ phoneNumber }: OrderSummaryProps) {
  const { totalCost, formatPrice, validateAndCheckout, items } = useCart();

  const handleCheckout = () => {
    const validation = validateAndCheckout();
    if (!validation.isValid) {
      toast.error("Please check your cart items before checkout");
      return;
    }

    if (!phoneNumber) {
      toast.error("Phone number not available. Please contact us directly.");
      return;
    }

    // Clean phone number - remove non-numeric characters except +
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, "");

    // Build WhatsApp message
    let message = "Hi, I would like to place an order:\n\n";

    // Add each cart item
    items.forEach((item) => {
      const itemPrice = (item.price || 0) * item.quantity;
      message += `${item.name} x${item.quantity} - ${formatCurrency(
        itemPrice
      )}\n`;
    });

    // Add total
    message += `\nTotal: ${formatCurrency(totalCost)}`;

    // Encode message (encodeURIComponent handles %0a automatically for newlines)
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
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
        <Alert className="mt-4">
          {getSocialIcon("whatsapp")}
          <AlertTitle>Checkout via WhatsApp</AlertTitle>
          <AlertDescription className="text-xs">
            Clicking checkout will open WhatsApp with your order details
            prefilled. Simply review and send to complete your order.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
