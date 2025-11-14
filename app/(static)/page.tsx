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
import { createCollectionTag } from "@/sanity/lib/cache-tags";
import { JsonLdScript } from "@/components/json-ld/json-ld-script";
import { generateFAQSchema } from "@/lib/json-ld/faq";

export default async function Home() {
  const siteConfig = await sanityFetch<SITE_CONFIG_QUERYResult>({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
  });
  const faqs = await sanityFetch<FAQS_QUERYResult>({
    query: FAQS_QUERY,
    tags: [createCollectionTag("faqs")],
  });

  // Generate FAQ schema
  const faqSchema = generateFAQSchema({ faqs });

  return (
    <>
      {/* JSON-LD for FAQs */}
      {faqSchema && <JsonLdScript data={faqSchema} />}

      <main>
        <Hero heroImages={siteConfig?.heroImages || []} />
        <FeaturedMenuItems
          featuredMenuItems={siteConfig?.featuredMenuItems || []}
        />
        <Stats />
        <AboutUs />
        <Faqs faqs={faqs} />
      </main>
    </>
  );
}
