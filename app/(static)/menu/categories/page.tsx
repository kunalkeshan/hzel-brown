import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/menu";
import type { ALL_CATEGORIES_QUERYResult } from "@/types/cms";
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
import { urlFor } from "@/sanity/lib/image";
import { MotionSection } from "@/components/ui/motion-section";

export default async function CategoriesPage() {
  const categories = await sanityFetch<ALL_CATEGORIES_QUERYResult>({
    query: ALL_CATEGORIES_QUERY,
  });

  return (
    <main className="py-16 lg:pt-40">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:max-w-7xl">
          {/* Header Section */}
          <MotionSection className="border-b border-border pb-10 mb-10">
            <h1 className="text-pretty text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
              Our Categories
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-muted-foreground sm:max-w-md sm:text-xl/8 lg:max-w-none">
              Explore our carefully curated menu categories, each featuring
              handcrafted desserts and treats made with the finest ingredients.
            </p>
          </MotionSection>

          {/* Categories Grid */}
          {categories && categories.length > 0 ? (
            <MotionSection className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => {
                const imageUrl = category.thumbnail?.asset
                  ? urlFor(category.thumbnail.asset)
                      .format("webp")
                      .quality(80)
                      .width(600)
                      .height(400)
                      .url()
                  : null;

                const categorySlug = category.slug?.current;

                if (!categorySlug) return null;

                return (
                  <Link
                    key={category._id}
                    href={`/menu/${categorySlug}`}
                    prefetch={false}
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-lg cursor-pointer group overflow-hidden pt-0">
                      <div className="w-full aspect-3/2 overflow-hidden relative">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={
                              category.thumbnail?.alt || category.title || ""
                            }
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {category.title}
                        </CardTitle>
                        {category.description && (
                          <CardDescription>
                            {category.description}
                          </CardDescription>
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
                  <EmptyTitle>No categories available</EmptyTitle>
                  <EmptyDescription>
                    Categories will appear here once they are added to the menu.
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
