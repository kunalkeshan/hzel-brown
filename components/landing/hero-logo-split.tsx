import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/ui/motion-section";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

interface HeroLogoSplitProps {
  heroImages: NonNullable<SITE_CONFIG_QUERYResult>["heroImages"];
}

export function HeroLogoSplit({ heroImages = [] }: HeroLogoSplitProps) {
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
            id="hero-logo-split-pattern"
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
          fill="url(#hero-logo-split-pattern)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>

      <div className="container py-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Side - Logo Dominant */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="mb-8">
                <Image
                  src="/assets/logo-text.png"
                  alt="Hzel Brown"
                  width={600}
                  height={240}
                  className="w-full max-w-md lg:max-w-lg h-auto"
                  priority
                />
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mb-6">
                Authentic flavors, crafted with love
              </h2>
              <p className="text-lg font-medium text-muted-foreground mb-8 max-w-xl">
                Artisan dessert shop curating handcrafted brownies, brookies,
                cupcakes and cookies, freshly baked with love. Order now, delivery
                across Tamil Nadu.
              </p>
              <div className="flex items-center gap-4">
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

            {/* Right Side - Images as Sidebar */}
            <div className="flex-shrink-0">
              {/* Mobile: Grid */}
              <div className="grid grid-cols-2 gap-4 lg:hidden">
                {processedImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative w-32 h-32 overflow-hidden rounded-2xl">
                    <Image
                      alt={image.alt}
                      src={image.src}
                      fill
                      className="object-cover"
                      sizes="128px"
                      priority={index < 2}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop: Vertical Stack */}
              <div className="hidden lg:flex flex-col gap-6">
                {processedImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative w-64 h-40 overflow-hidden rounded-2xl">
                    <Image
                      alt={image.alt}
                      src={image.src}
                      fill
                      className="object-cover"
                      sizes="256px"
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
