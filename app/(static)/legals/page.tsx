import Link from "next/link";
import { FileText } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { LEGAL_DOCUMENTS_QUERY } from "@/sanity/queries/legal";
import type { LEGAL_DOCUMENTS_QUERYResult } from "@/types/cms";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { MotionSection } from "@/components/ui/motion-section";

export default async function AllLegalItemsPage() {
  const legalDocuments = await sanityFetch<LEGAL_DOCUMENTS_QUERYResult>({
    query: LEGAL_DOCUMENTS_QUERY,
  });

  return (
    <main className="py-16 lg:pt-40">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:max-w-7xl">
          {/* Header Section */}
          <MotionSection className="border-b border-border pb-10 mb-10">
            <h1 className="text-pretty text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
              Legal Documents
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-muted-foreground sm:max-w-md sm:text-xl/8 lg:max-w-none">
              Browse through our legal documents, terms & conditions, privacy
              policies, and other important information.
            </p>
          </MotionSection>

          {/* Legal Documents Grid */}
          {legalDocuments && legalDocuments.length > 0 ? (
            <MotionSection className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {legalDocuments.map((legal) => {
                const legalSlug = legal.slug?.current;

                if (!legalSlug) return null;

                return (
                  <Link
                    key={legal._id}
                    href={`/legals/${legalSlug}`}
                    prefetch={false}
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-lg cursor-pointer group overflow-hidden pt-0">
                      <div className="w-full aspect-3/2 overflow-hidden relative bg-muted flex items-center justify-center">
                        <FileText
                          className="h-10 w-10 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {legal.title}
                        </CardTitle>
                        {legal.description && (
                          <CardDescription>{legal.description}</CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </MotionSection>
          ) : (
            <MotionSection>
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No legal documents available</EmptyTitle>
                  <EmptyDescription>
                    Legal documents will appear here once they are added.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </MotionSection>
          )}
        </div>
      </div>
    </main>
  );
}
