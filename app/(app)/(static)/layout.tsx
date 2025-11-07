import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { FloatingCheckoutButton } from "@/components/cart/floating-checkout-button";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  SITE_CONFIG_QUERY,
  FOOTER_LEGAL_LINKS_QUERY,
} from "@/sanity/queries/site-config";
import {
  SITE_CONFIG_QUERYResult,
  FOOTER_LEGAL_LINKS_QUERYResult,
} from "@/types/cms";

export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteConfig, legalLinks] = await Promise.all([
    sanityFetch<SITE_CONFIG_QUERYResult>({
      query: SITE_CONFIG_QUERY,
      tags: ["siteConfig"],
    }),
    sanityFetch<FOOTER_LEGAL_LINKS_QUERYResult>({
      query: FOOTER_LEGAL_LINKS_QUERY,
      tags: ["siteConfig"],
    }),
  ]);
  return (
    <>
      <Navbar />
      {children}
      <Footer siteConfig={siteConfig} legalLinks={legalLinks} />
      <FloatingCheckoutButton />
    </>
  );
}
