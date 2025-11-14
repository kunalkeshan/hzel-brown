import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { FloatingCheckoutButton } from "@/components/cart/floating-checkout-button";
import { ViewTransitionWrapper } from "@/components/layouts/view-transition-wrapper";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  SITE_CONFIG_QUERY,
  FOOTER_LEGAL_LINKS_QUERY,
} from "@/sanity/queries/site-config";
import {
  SITE_CONFIG_QUERYResult,
  FOOTER_LEGAL_LINKS_QUERYResult,
} from "@/types/cms";
import { urlFor } from "@/sanity/lib/image";
import { createCollectionTag } from "@/sanity/lib/cache-tags";
import { JsonLdScript } from "@/components/json-ld/json-ld-script";
import { generateOrganizationSchema } from "@/lib/json-ld/organization";
import { generateWebSiteSchema } from "@/lib/json-ld/website";
import { SITE_CONFIG } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await sanityFetch<SITE_CONFIG_QUERYResult>({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
  });

  const title = siteConfig?.title || "Hzel Brown";
  const description =
    siteConfig?.description ||
    "Artisan dessert shop curating handcrafted brownies, brookies, cupcakes and cookies, freshly baked with love. Order now, delivery across Tamil Nadu.";

  const ogImageUrl = siteConfig?.ogImage?.asset
    ? urlFor(siteConfig.ogImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : undefined;
  const twitterImageUrl = siteConfig?.twitterImage?.asset
    ? urlFor(siteConfig.twitterImage)
        .width(1200)
        .height(600)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : ogImageUrl;

  return {
    title: {
      template: `%s | ${siteConfig?.title}`,
      default: title,
    },
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              alt: siteConfig?.ogImage?.alt || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteConfig, legalLinks] = await Promise.all([
    sanityFetch<SITE_CONFIG_QUERYResult>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
    sanityFetch<FOOTER_LEGAL_LINKS_QUERYResult>({
      query: FOOTER_LEGAL_LINKS_QUERY,
      tags: [createCollectionTag("siteConfig")],
    }),
  ]);

  // Generate JSON-LD schemas
  const baseUrl = SITE_CONFIG.URL;
  const organizationSchema = siteConfig
    ? generateOrganizationSchema({ siteConfig, baseUrl })
    : null;
  const websiteSchema = generateWebSiteSchema({
    siteName: siteConfig?.title || "Hzel Brown",
    siteDescription:
      siteConfig?.description ||
      "Artisan dessert shop curating handcrafted brownies, brookies, cupcakes and cookies, freshly baked with love.",
    baseUrl,
  });

  return (
    <>
      {/* JSON-LD Structured Data */}
      {organizationSchema && <JsonLdScript data={organizationSchema} />}
      <JsonLdScript data={websiteSchema} />

      <NuqsAdapter>
        <ViewTransitionWrapper>
          <Navbar />
          {children}
          <Footer siteConfig={siteConfig} legalLinks={legalLinks} />
          <Toaster richColors />
          <FloatingCheckoutButton />
        </ViewTransitionWrapper>
      </NuqsAdapter>
    </>
  );
}
