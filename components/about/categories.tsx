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

export async function Categories() {
  const categories = await sanityFetch<ALL_CATEGORIES_QUERYResult>({
    query: ALL_CATEGORIES_QUERY,
  });

  return (
    <MotionSection className="py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-14">
          {/* Text Content */}
          <div className="flex flex-col gap-3 h-fit lg:sticky lg:top-32">
            <h2 className="text-4xl font-bold text-foreground font-serif text-center xl:text-start">
              Our Homemade Selection
            </h2>
            <p className="text-xl font-normal leading-8 text-muted-foreground text-center xl:text-start">
              Explore our carefully curated menu categories, each featuring
              handcrafted desserts and treats made with the finest ingredients.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
            {categories && categories.length > 0 ? (
              categories.map((category) => {
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
              })
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No categories available</EmptyTitle>
                  <EmptyDescription>
                    Categories will appear here once they are added to the menu.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
