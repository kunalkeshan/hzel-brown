import React from "react";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  LEGAL_DOCUMENT_BY_SLUG_QUERY,
  LEGAL_DOCUMENTS_QUERY,
} from "@/sanity/queries/legal";
import type {
  LEGAL_DOCUMENT_BY_SLUG_QUERYResult,
  LEGAL_DOCUMENTS_QUERYResult,
} from "@/types/cms";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/sanity/lib/portable-text-components";
import { MotionSection } from "@/components/ui/motion-section";
import * as motion from "motion/react-client";
import { format } from "date-fns";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createCollectionTag, createDocumentTag } from "@/sanity/lib/cache-tags";

interface LegalDocumentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const legalDocuments = await sanityFetch<LEGAL_DOCUMENTS_QUERYResult>({
    query: LEGAL_DOCUMENTS_QUERY,
    tags: [createCollectionTag("legal")],
  });

  return legalDocuments
    .map((doc) => ({
      slug: doc.slug?.current || "",
    }))
    .filter((params) => params.slug); // Filter out empty slugs
}

export async function generateMetadata({
  params,
}: LegalDocumentPageProps): Promise<Metadata> {
  const { slug } = await params;

  const legalDocument = await sanityFetch<LEGAL_DOCUMENT_BY_SLUG_QUERYResult>({
    query: LEGAL_DOCUMENT_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("legal"), createDocumentTag("legal", slug)],
  });

  if (!legalDocument) {
    return {
      title: "Legal Document",
      description: "Legal information and policies.",
    };
  }

  const title = legalDocument.title || "Legal Document";
  const description =
    legalDocument.description ||
    `Read our ${legalDocument.title} to understand our policies and terms.`;

  return {
    title,
    description,
  };
}

export default async function LegalDocumentPage({
  params,
}: LegalDocumentPageProps) {
  const { slug } = await params;

  const legalDocument = await sanityFetch<LEGAL_DOCUMENT_BY_SLUG_QUERYResult>({
    query: LEGAL_DOCUMENT_BY_SLUG_QUERY,
    params: { slug },
    tags: [createCollectionTag("legal"), createDocumentTag("legal", slug)],
  });

  if (!legalDocument) {
    notFound();
  }

  return (
    <main className="py-16 lg:pt-40">
      <div className="container">
        <MotionSection className="mb-8">
          <Button asChild variant="link" className="group">
            <Link href="/legals" prefetch={false}>
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Legal Documents
            </Link>
          </Button>
        </MotionSection>

        <MotionSection className="text-left" delay={0.2}>
          <div className="mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-pretty text-5xl font-semibold tracking-tight text-foreground sm:text-7xl mb-4 text-left"
            >
              {legalDocument.title}
            </motion.h1>
            {legalDocument.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-muted-foreground text-left"
              >
                {legalDocument.description}
              </motion.p>
            )}

            {/* Last Updated */}
            {legalDocument._updatedAt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-start text-sm text-muted-foreground mt-4"
              >
                <Clock className="w-4 h-4 mr-2" />
                Last updated on{" "}
                {format(new Date(legalDocument._updatedAt), "MMMM d, yyyy")}
              </motion.div>
            )}
          </div>
        </MotionSection>

        {legalDocument.content ? (
          <MotionSection delay={0.3}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="prose prose-gray max-w-none dark:prose-invert prose-lg text-left prose-headings:font-semibold prose-headings:text-foreground prose-headings:text-left prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-justify prose-li:text-muted-foreground prose-li:text-justify prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:text-justify"
            >
              <PortableText
                value={legalDocument.content}
                components={portableTextComponents}
              />
            </motion.div>
          </MotionSection>
        ) : (
          <MotionSection delay={0.3} className="mt-16 text-left">
            <p className="text-muted-foreground">
              The content for this legal document is not yet available.
            </p>
          </MotionSection>
        )}

        {/* Footer Navigation */}
        <MotionSection
          delay={0.4}
          className="mt-16 pt-8 border-t border-border"
        >
          <div className="flex justify-center">
            <Link
              href="/legals"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-accent transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Legal Documents
            </Link>
          </div>
        </MotionSection>
      </div>
    </main>
  );
}
