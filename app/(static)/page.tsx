import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { AboutUs } from "@/components/landing/about-us";
import { Faqs } from "@/components/common/faqs";
import { FeaturedMenuItems } from "@/components/menu/featured-menu-items";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site-config";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";
import { FAQS_QUERY } from "@/sanity/queries/faqs";
import type { FAQS_QUERYResult } from "@/types/cms";

export default async function Home() {
  const siteConfig = await sanityFetch<SITE_CONFIG_QUERYResult>({
    query: SITE_CONFIG_QUERY,
    tags: ["siteConfig"],
  });
  const faqs = await sanityFetch<FAQS_QUERYResult>({
    query: FAQS_QUERY,
    tags: ["faqs"],
  });

  return (
    <main>
      <Hero heroImages={siteConfig?.heroImages || []} />
      <FeaturedMenuItems
        featuredMenuItems={siteConfig?.featuredMenuItems || []}
      />
      <Stats />
      <AboutUs />
      <Faqs faqs={faqs} />
    </main>
  );
}
