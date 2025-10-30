import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/ui/motion-section";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { MenuItemCard } from "./menu-item-card";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";

interface FeaturedMenuItemsProps {
  featuredMenuItems: NonNullable<SITE_CONFIG_QUERYResult>["featuredMenuItems"];
}

export function FeaturedMenuItems({
  featuredMenuItems = [],
}: FeaturedMenuItemsProps) {
  // Filter out any null items and only show available items
  const availableItems = (featuredMenuItems || []).filter(
    (item) => item && item.isAvailable
  );

  if (!availableItems || availableItems.length === 0) {
    return (
      <MotionSection className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <p className="px-2 border border-primary/30 rounded-full bg-primary/10 text-xs font-medium leading-6 text-primary mb-4 w-fit mx-auto">
              Featured Items
            </p>
            <h2 className="font-serif text-4xl text-foreground font-bold mb-4">
              Our Featured Menu
            </h2>
          </div>

          <Empty className="border border-dashed border-border">
            <EmptyHeader>
              <EmptyTitle>No Featured Items Available</EmptyTitle>
              <EmptyDescription>
                We're currently updating our featured menu items. Please check
                back soon or{" "}
                <Link href="/menu" className="text-primary hover:underline">
                  browse our full menu
                </Link>
                .
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/menu">View Full Menu</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </MotionSection>
    );
  }

  return (
    <MotionSection className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <p className="px-2 border border-primary/30 rounded-full bg-primary/10 text-xs font-medium leading-6 text-primary mb-4 w-fit mx-auto">
            Featured Items
          </p>
          <h2 className="font-serif text-4xl text-foreground font-bold mb-4">
            Our Featured Menu
          </h2>
          <p className="text-xl font-normal leading-8 text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of the most loved treats, crafted
            with premium ingredients and baked fresh daily.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {availableItems.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              className="mx-auto sm:mx-0"
            />
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="group">
            <Link href="/menu" className="flex items-center gap-2">
              View Full Menu
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </MotionSection>
  );
}
