import { PlusIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MotionSection } from "../ui/motion-section";
import Link from "next/link";
import type { FAQS_QUERYResult } from "@/types/cms";

interface FaqsProps {
  faqs: FAQS_QUERYResult | null;
}

export function Faqs({ faqs }: FaqsProps) {
  return (
    <MotionSection className="grid w-full container grid-cols-1 md:grid-cols-2 lg:border-x py-16 lg:py-20 gap-8">
      <div>
        <div className="space-y-5 h-fit lg:sticky lg:top-32">
          <h2 className="text-4xl font-bold text-foreground font-serif text-center xl:text-start">
            {faqs?.title || "Frequently Asked Questions"}
          </h2>
          <p className="text-xl font-normal leading-8 text-muted-foreground text-center xl:text-start">
            Quick answers to common questions about our bakery orders, delivery,
            and custom treats. Click on a question for more details.
          </p>
          <p className="text-xl font-normal leading-8 text-muted-foreground text-center xl:text-start">
            {"Can't find the answer you need? "}
            <Link
              href="/contact"
              className="text-primary hover:underline"
              prefetch={false}
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
      <div className="relative place-content-center">
        {/* vertical guide line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-3 h-full w-px bg-border"
        />

        <Accordion collapsible type="single">
          {(faqs?.faqItems || []).map((item) => (
            <AccordionItem
              className="group relative border-b pl-5 first:border-t last:border-b"
              key={item._key || "faq-item"}
              value={item._key || "faq-item"}
            >
              {/*  plus */}
              <PlusIcon
                aria-hidden="true"
                className="-bottom-[5.5px] -translate-x-1/2 pointer-events-none absolute left-[12.5px] size-2.5 text-muted-foreground group-last:hidden"
              />

              <AccordionTrigger className="cursor-pointer px-4 py-4 text-[15px] leading-6">
                {item.question}
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </MotionSection>
  );
}
