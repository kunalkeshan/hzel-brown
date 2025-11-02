import { Home, ForkKnifeCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import Navbar from "@/components/layouts/navbar";
import {
  SITE_CONFIG_QUERY,
  FOOTER_LEGAL_LINKS_QUERY,
} from "@/sanity/queries/site-config";
import {
  SITE_CONFIG_QUERYResult,
  FOOTER_LEGAL_LINKS_QUERYResult,
} from "@/types/cms";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import Footer from "@/components/layouts/footer";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "404 - Page Not Found",
    description:
      "The page you're looking for might have been moved or doesn't exist.",
  };
}

export default async function NotFoundPage() {
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
      <main className="flex w-full items-center justify-center">
        <div className="flex items-center border-x min-h-screen">
          <div className="">
            <div className="absolute inset-x-0 h-px bg-border" />
            <Empty>
              <EmptyHeader>
                <EmptyTitle className="font-black font-mono text-8xl">
                  404
                </EmptyTitle>
                <EmptyDescription className="text-nowrap">
                  The page you're looking for might have been <br />
                  moved or doesn't exist.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/" prefetch={false}>
                      <Home /> Go Home
                    </Link>
                  </Button>

                  <Button asChild variant="outline">
                    <Link href="/menu" prefetch={false}>
                      <ForkKnifeCrossed /> Menu
                    </Link>
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
            <div className="absolute inset-x-0 h-px bg-border" />
          </div>
        </div>
      </main>
      <Footer siteConfig={siteConfig} legalLinks={legalLinks} />
    </>
  );
}
