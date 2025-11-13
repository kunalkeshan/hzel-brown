import type { WithContext, FAQPage } from "schema-dts";
import type { FAQS_QUERYResult } from "@/types/cms";

interface FAQSchemaProps {
  faqs: FAQS_QUERYResult;
}

/**
 * Generates FAQPage schema for FAQ sections
 * @see https://schema.org/FAQPage
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function generateFAQSchema({
  faqs,
}: FAQSchemaProps): WithContext<FAQPage> | null {
  if (!faqs || !faqs.faqItems || faqs.faqItems.length === 0) {
    return null;
  }

  const mainEntity = faqs.faqItems
    .filter((item) => item.question && item.answer)
    .map((item) => ({
      "@type": "Question" as const,
      name: item.question!,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answer!,
      },
    }));

  if (mainEntity.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
