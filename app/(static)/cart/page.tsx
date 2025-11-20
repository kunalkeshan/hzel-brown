import { Content } from "@/components/cart/content";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site-config";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";
import type { Metadata } from "next";
import { createCollectionTag } from "@/sanity/lib/cache-tags";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart",
};

export default async function CartPage() {
  const siteConfig = await sanityFetch<SITE_CONFIG_QUERYResult>({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
  });

  // Extract primary phone number (phone with label "Primary" or first phone number)
  const phoneNumber =
    siteConfig?.phoneNumbers?.find((phone) =>
      phone.label?.toLowerCase().includes("primary")
    )?.number ||
    siteConfig?.phoneNumbers?.[0]?.number ||
    null;

  // Extract shipping configuration
  const shippingConfig = {
    freeShippingThreshold: siteConfig?.freeShippingThreshold ?? 3000,
    shippingCost: siteConfig?.shippingCost ?? 0,
  };

  return (
    <main className="py-16 lg:pt-40">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Shopping Cart
        </h1>
        <Content phoneNumber={phoneNumber} shippingConfig={shippingConfig} />
      </div>
    </main>
  );
}
