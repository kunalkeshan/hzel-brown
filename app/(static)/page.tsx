import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { AboutUs } from "@/components/landing/about-us";
import { FeaturedMenuItems } from "@/components/menu/featured-menu-items";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site-config";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

export default async function Home() {
  const siteConfig = await sanityFetch<SITE_CONFIG_QUERYResult>({
    query: SITE_CONFIG_QUERY,
    tags: ["siteConfig"],
  });

  return (
    <main>
      <Hero heroImages={siteConfig?.heroImages || []} />
      <FeaturedMenuItems
        featuredMenuItems={siteConfig?.featuredMenuItems || []}
      />
      <Stats />
      <AboutUs />
    </main>
  );
}
