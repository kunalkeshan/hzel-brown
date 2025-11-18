import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/ui/motion-section";
import { urlFor } from "@/sanity/lib/image";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

interface HeroLogoOverlayProps {
  heroImages: NonNullable<SITE_CONFIG_QUERYResult>["heroImages"];
}

export function HeroLogoOverlay({ heroImages = [] }: HeroLogoOverlayProps) {
  const processedImages = (heroImages || [])
    .map((image, index) => {
      return {
        src: image?.asset
          ? urlFor(image.asset)
              .format("webp")
              .quality(80)
              .width(600)
              .height(600)
              .url()
          : "",
        alt: image?.alt || `Hero image ${index + 1}`,
      };
    })
    .filter((image) => image.src);

  return (
    <MotionSection>
      <div className="container py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Full Width Image Grid with Overlay */}
          <div className="relative w-full min-h-[600px] lg:min-h-[700px] rounded-3xl overflow-hidden">
            {/* Background Image Grid - Subtle */}
            <div className="absolute inset-0">
              {/* Mobile: 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2 h-full lg:hidden">
                {processedImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative w-full h-full">
                    <Image
                      alt={image.alt}
                      src={image.src}
                      fill
                      className="object-cover opacity-40"
                      sizes="50vw"
                      priority={index < 2}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop: 2x2 Grid */}
              <div className="hidden lg:grid grid-cols-2 gap-4 h-full">
                {processedImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative w-full h-full">
                    <Image
                      alt={image.alt}
                      src={image.src}
                      fill
                      className="object-cover opacity-30"
                      sizes="50vw"
                      priority={index < 2}
                    />
                  </div>
                ))}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/90 to-background/80" />
            </div>

            {/* Centered Content with Logo */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] lg:min-h-[700px] px-4 text-center">
              <div className="mb-12">
                <Image
                  src="/assets/logo-text.png"
                  alt="Hzel Brown"
                  width={700}
                  height={280}
                  className="w-full max-w-xl lg:max-w-3xl h-auto drop-shadow-xl"
                  priority
                />
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 max-w-3xl">
                Authentic flavors, crafted with love
              </h2>
              <p className="text-lg lg:text-xl font-medium text-muted-foreground mb-10 max-w-2xl">
                Artisan dessert shop curating handcrafted brownies, brookies,
                cupcakes and cookies, freshly baked with love. Order now, delivery
                across Tamil Nadu.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
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
      </div>
    </MotionSection>
  );
}
