import type { WithContext, Bakery } from "schema-dts";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";
import { createAbsoluteUrl } from "./utils";

interface OrganizationSchemaProps {
  siteConfig: SITE_CONFIG_QUERYResult;
  baseUrl: string;
}

/**
 * Generates Organization (Bakery) schema for the business
 * @see https://schema.org/Bakery
 * @see https://schema.org/FoodEstablishment
 */
export function generateOrganizationSchema({
  siteConfig,
  baseUrl,
}: OrganizationSchemaProps): WithContext<Bakery> {
  if (!siteConfig) {
    throw new Error("Site config is required to generate organization schema");
  }

  // Build address object
  const address = siteConfig.address
    ? {
        "@type": "PostalAddress" as const,
        streetAddress: siteConfig.address.street || undefined,
        addressLocality: siteConfig.address.city || undefined,
        addressRegion: siteConfig.address.state || undefined,
        postalCode: siteConfig.address.postalCode || undefined,
        addressCountry: siteConfig.address.country || undefined,
      }
    : undefined;

  // Build contact points
  const contactPoint: Array<{
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    email?: string;
  }> = [];

  if (siteConfig.phoneNumbers && siteConfig.phoneNumbers.length > 0) {
    siteConfig.phoneNumbers.forEach((phone) => {
      if (phone.number) {
        contactPoint.push({
          "@type": "ContactPoint",
          telephone: phone.number,
          contactType: phone.label || "customer service",
        });
      }
    });
  }

  if (siteConfig.emails && siteConfig.emails.length > 0) {
    siteConfig.emails.forEach((emailObj) => {
      if (emailObj.email) {
        contactPoint.push({
          "@type": "ContactPoint",
          email: emailObj.email,
          contactType: emailObj.label || "customer service",
        });
      }
    });
  }

  // Build social media profiles
  const sameAs: string[] = [];
  if (siteConfig.socialMedia && siteConfig.socialMedia.length > 0) {
    siteConfig.socialMedia.forEach((social) => {
      if (social.url) {
        sameAs.push(social.url);
      }
    });
  }

  const schema: WithContext<Bakery> = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: siteConfig.title || "Hzel Brown",
    description:
      siteConfig.description ||
      "Artisan dessert shop curating handcrafted brownies, brookies, cupcakes and cookies, freshly baked with love.",
    url: baseUrl,
    logo: createAbsoluteUrl("/assets/logo-text.png", baseUrl),
    image: createAbsoluteUrl("/assets/logo.png", baseUrl),
    ...(address && { address }),
    ...(contactPoint.length > 0 && { contactPoint }),
    ...(sameAs.length > 0 && { sameAs }),
    // Service area - Tamil Nadu
    areaServed: {
      "@type": "State",
      name: "Tamil Nadu",
    },
    // Cuisine type
    servesCuisine: "Bakery",
    // Payment methods accepted (common for Indian bakeries)
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI",
    // Price range (can be adjusted)
    priceRange: "₹₹",
  };

  return schema;
}
