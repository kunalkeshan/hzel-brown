import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/ui/motion-section";
import { urlFor } from "@/sanity/lib/image";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

interface HeroLogoAsymmetricProps {
  heroImages: NonNullable<SITE_CONFIG_QUERYResult>["heroImages"];
}

export function HeroLogoAsymmetric({ heroImages = [] }: HeroLogoAsymmetricProps) {
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
    <MotionSection className="relative">
      {/* Decorative SVG Background */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-full w-full stroke-border mask-[radial-gradient(32rem_32rem_at_center,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="hero-logo-asymmetric-pattern"
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
          fill="url(#hero-logo-asymmetric-pattern)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>

      <div className="container py-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Asymmetric Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left - Large Logo Area (spans 7 columns) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-muted/50 to-background rounded-3xl p-8 lg:p-12 border border-border shadow-xl">
                  <Image
                    src="/assets/logo-text.png"
                    alt="Hzel Brown"
                    width={700}
                    height={280}
                    className="w-full h-auto mb-8"
                    priority
                  />
                  <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
                    Authentic flavors, crafted with love
                  </h2>
                  <p className="text-base lg:text-lg font-medium text-muted-foreground mb-8">
                    Artisan dessert shop curating handcrafted brownies, brookies,
                    cupcakes and cookies, freshly baked with love. Order now, delivery
                    across Tamil Nadu.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href="/contact">Order Now</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                      <Link
                        href="/menu"
                        className="text-sm/6 font-semibold"
                      >
                        View Menu <span aria-hidden="true">→</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Small Image Accents (spans 5 columns) */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              {/* Mobile: Horizontal Scroll */}
              <div className="flex gap-4 overflow-x-auto pb-4 lg:hidden snap-x snap-mandatory">
                {processedImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative w-48 h-48 flex-shrink-0 snap-center overflow-hidden rounded-2xl">
                    <Image
                      alt={image.alt}
                      src={image.src}
                      fill
                      className="object-cover"
                      sizes="192px"
                      priority={index < 2}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop: Staggered Grid */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {processedImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl ${
                      index === 0 ? "col-span-2 h-48" :
                      index === 1 ? "h-64" :
                      index === 2 ? "h-48" : "h-64"
                    }`}
                  >
                    <Image
                      alt={image.alt}
                      src={image.src}
                      fill
                      className="object-cover"
                      sizes={index === 0 ? "400px" : "200px"}
                      priority={index < 2}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
