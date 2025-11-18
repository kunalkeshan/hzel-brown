import { Hero } from "@/components/landing/hero";
import { HeroLogoCenter } from "@/components/landing/hero-logo-center";
import { HeroLogoBanner } from "@/components/landing/hero-logo-banner";
import { HeroLogoSplit } from "@/components/landing/hero-logo-split";
import { HeroLogoOverlay } from "@/components/landing/hero-logo-overlay";
import { HeroLogoAsymmetric } from "@/components/landing/hero-logo-asymmetric";
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
        {/* Original Hero */}
        <Hero heroImages={siteConfig?.heroImages || []} />

        {/* Hero Variant 1: Logo Center - Logo absolutely positioned in center of 4 images */}
        <HeroLogoCenter heroImages={siteConfig?.heroImages || []} />

        {/* Hero Variant 2: Logo Banner - LinkedIn/Facebook style banner with logo overlay */}
        <HeroLogoBanner heroImages={siteConfig?.heroImages || []} />

        {/* Hero Variant 3: Logo Split - Logo dominant on left, images as sidebar */}
        <HeroLogoSplit heroImages={siteConfig?.heroImages || []} />

        {/* Hero Variant 4: Logo Overlay - Large overlay with centered logo */}
        <HeroLogoOverlay heroImages={siteConfig?.heroImages || []} />

        {/* Hero Variant 5: Logo Asymmetric - Asymmetric layout with logo in card */}
        <HeroLogoAsymmetric heroImages={siteConfig?.heroImages || []} />

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
