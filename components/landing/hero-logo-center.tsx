import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/ui/motion-section";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

interface HeroLogoCenterProps {
  heroImages: NonNullable<SITE_CONFIG_QUERYResult>["heroImages"];
}

export function HeroLogoCenter({ heroImages = [] }: HeroLogoCenterProps) {
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
    .filter((image) => image.src);

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
            id="hero-logo-center-pattern"
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
          fill="url(#hero-logo-center-pattern)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>

      <div className="container py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Image Grid with Centered Logo */}
          <div className="relative mx-auto max-w-4xl">
            {/* Mobile: Simple Grid */}
            <div className="relative grid grid-cols-2 gap-4 lg:hidden">
              {processedImages.slice(0, 4).map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    alt={image.alt}
                    src={image.src}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 45vw, 200px"
                    priority={index < 2}
                  />
                </div>
              ))}

              {/* Centered Logo - Mobile */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative bg-background/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-border">
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
            <div className="hidden lg:block relative">
              <div className="flex justify-center items-start gap-8">
                {/* Left Column */}
                <div className="flex-col justify-start items-start gap-8 inline-flex">
                  {processedImages.slice(0, 2).map((image, index) => (
                    <div key={index} className="relative w-[280px] h-[280px] overflow-hidden rounded-2xl">
                      <Image
                        alt={image.alt}
                        src={image.src}
                        fill
                        className="object-cover"
                        sizes="280px"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="flex-col justify-start items-start gap-8 inline-flex">
                  {processedImages.slice(2, 4).map((image, index) => (
                    <div key={index + 2} className="relative w-[280px] h-[280px] overflow-hidden rounded-2xl">
                      <Image
                        alt={image.alt}
                        src={image.src}
                        fill
                        className="object-cover"
                        sizes="280px"
                        priority={false}
                      />
                    </div>
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

          {/* Text Content Below */}
          <div className="mt-12 text-center max-w-3xl mx-auto">
            <p className="text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">
              Artisan dessert shop curating handcrafted brownies, brookies,
              cupcakes and cookies, freshly baked with love. Order now, delivery
              across Tamil Nadu.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
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
        </div>
      </div>
    </MotionSection>
  );
}
