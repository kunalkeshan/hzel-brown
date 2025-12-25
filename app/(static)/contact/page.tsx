import { Contact } from "@/components/contact/contact";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site-config";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";
import type { Metadata } from "next";
import { createCollectionTag } from "@/sanity/lib/cache-tags";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Order fresh, home-baked brownies, brookies, cupcakes & cookies. Get in touch!",
};

export default async function ContactPage() {
  const siteConfig = await sanityFetch<SITE_CONFIG_QUERYResult>({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
  });

  return (
    <main className="">
      <Contact siteConfig={siteConfig} />
    </main>
  );
}
