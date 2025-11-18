import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/ui/motion-section";
import { urlFor } from "@/sanity/lib/image";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

interface HeroLogoBannerProps {
  heroImages: NonNullable<SITE_CONFIG_QUERYResult>["heroImages"];
}

export function HeroLogoBanner({ heroImages = [] }: HeroLogoBannerProps) {
  const processedImages = (heroImages || [])
    .map((image, index) => {
      return {
        src: image?.asset
          ? urlFor(image.asset)
              .format("webp")
              .quality(80)
              .width(800)
              .height(400)
              .url()
          : "",
        alt: image?.alt || `Hero image ${index + 1}`,
      };
    })
    .filter((image) => image.src);

  // Use first image as banner background, fallback to all images in grid
  const bannerImage = processedImages[0];

  return (
    <MotionSection>
      <div className="container py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Banner Style - Like LinkedIn/Facebook Cover */}
          <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
            {/* Background Images Grid */}
            <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4">
              {processedImages.slice(0, 4).map((image, index) => (
                <div key={index} className="relative w-full h-full">
                  <Image
                    alt={image.alt}
                    src={image.src}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Dark Overlay for Better Contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

            {/* Centered Logo and Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <div className="mb-8">
                <Image
                  src="/assets/logo-text.png"
                  alt="Hzel Brown"
                  width={500}
                  height={200}
                  className="w-auto h-20 lg:h-32 drop-shadow-2xl"
                  priority
                />
              </div>
              <p className="text-white text-lg lg:text-2xl font-medium max-w-2xl mb-8 drop-shadow-lg">
                Authentic flavors, crafted with love
              </p>
              <div className="flex items-center gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">Order Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                  <Link href="/menu">
                    View Menu <span aria-hidden="true">→</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Description Below Banner */}
          <div className="mt-12 text-center max-w-3xl mx-auto">
            <p className="text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">
              Artisan dessert shop curating handcrafted brownies, brookies,
              cupcakes and cookies, freshly baked with love. Order now, delivery
              across Tamil Nadu.
            </p>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
