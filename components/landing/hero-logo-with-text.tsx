import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/ui/motion-section";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

interface HeroLogoWithTextProps {
  heroImages: NonNullable<SITE_CONFIG_QUERYResult>["heroImages"];
}

export function HeroLogoWithText({ heroImages = [] }: HeroLogoWithTextProps) {
  // Transform CMS images to include column assignments
  const processedImages = (heroImages || [])
    .map((image, index) => {
      return {
        src: image?.asset
          ? urlFor(image.asset)
              .format("webp")
              .quality(80)
              .width(400)
              .height(600)
              .url()
          : "",
        alt: image?.alt || `Hero image ${index + 1}`,
      };
    })
    .filter((image) => image.src); // Filter out images without valid assets
  return (
    <MotionSection>
      {/* Decorative SVG Background */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-full w-full stroke-border mask-[radial-gradient(32rem_32rem_at_center,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="hero-logo-with-text-pattern"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-muted">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          fill="url(#hero-logo-with-text-pattern)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>

      <div className="container flex items-center justify-center py-16 lg:pt-40">
        <div className="mx-auto max-w-2xl gap-x-8 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          {/* Text Content */}
          <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
            <h1 className="text-pretty text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
              Authentic flavors, crafted with love
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-muted-foreground sm:max-w-md sm:text-xl/8 lg:max-w-none">
              Artisan dessert shop curating handcrafted brownies, brookies,
              cupcakes and cookies, freshly baked with love. Order now, delivery
              across Tamil Nadu.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/contact">Order Now</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link
                  href="/menu"
                  className="text-sm/6 font-semibold text-foreground"
                >
                  View Menu <span aria-hidden="true">→</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Gallery - Two Column Layout with Centered Logo */}
          <div className="mt-12 lg:mt-0 lg:flex-1 lg:max-w-lg lg:ml-12">
            {/* Mobile: Simple Grid */}
            <div className="relative grid grid-cols-2 gap-4 lg:hidden">
              {processedImages.slice(0, 4).map((image, index) => (
                <Image
                  key={index}
                  alt={image.alt}
                  src={image.src}
                  width={200}
                  height={200}
                  className={cn(
                    "w-full aspect-square object-cover rounded-md",
                    {
                      "rounded-tl-4xl": index === 0,
                      "rounded-tr-4xl": index === 1,
                      "rounded-bl-4xl": index === 2,
                      "rounded-br-4xl": index === 3,
                    }
                  )}
                  sizes="(max-width: 768px) 150px, 200px"
                  priority={index < 2}
                />
              ))}

              {/* Centered Logo - Mobile */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative bg-background/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-border pointer-events-auto">
                  <Image
                    src="/assets/logo-text.png"
                    alt="Hzel Brown"
                    width={200}
                    height={80}
                    className="w-auto h-16"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Desktop: Two Column Layout */}
            <div
              className={cn("hidden lg:block relative")}
            >
              <div className={cn("flex justify-start items-start gap-8")}>
                <div
                  className={cn(
                    "flex-col justify-start items-start gap-8 inline-flex"
                  )}
                >
                  {processedImages.slice(0, 2).map((image, index) => (
                    <Image
                      key={index}
                      alt={image.alt}
                      src={image.src}
                      width={280}
                      height={280}
                      className={cn("object-cover aspect-square rounded-md", {
                        "rounded-tl-4xl": index === 0,
                        "rounded-bl-4xl": index === 1,
                      })}
                      sizes="280px"
                      priority={index === 0}
                    />
                  ))}
                </div>
                <div
                  className={cn(
                    "flex-col justify-start items-start gap-8 inline-flex"
                  )}
                >
                  {processedImages.slice(2, 4).map((image, index) => (
                    <Image
                      key={index + 2}
                      alt={image.alt}
                      src={image.src}
                      width={280}
                      height={280}
                      className={cn("object-cover aspect-square rounded-md", {
                        "rounded-tr-4xl": index === 0,
                        "rounded-br-4xl": index === 1,
                      })}
                      sizes="280px"
                      priority={false}
                    />
                  ))}
                </div>
              </div>

              {/* Centered Logo - Desktop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative bg-background/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-border pointer-events-auto">
                  <Image
                    src="/assets/logo-text.png"
                    alt="Hzel Brown"
                    width={400}
                    height={160}
                    className="w-auto h-24 lg:h-32"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
