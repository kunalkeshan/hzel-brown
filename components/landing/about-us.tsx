"use client";

import Link from "next/link";
import Image from "next/image";
import { ChefHat, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/ui/motion-section";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";

const aboutStats = [
  {
    icon: ChefHat,
    number: "Handcrafted",
    label: "Batches",
    animateNumber: false,
  },
  {
    icon: Users,
    number: 1000,
    numberSuffix: "+",
    label: "Happy Customers",
    animateNumber: true,
  },
] as const;

type AboutStatItem = (typeof aboutStats)[number];

export function AboutUs() {
  return (
    <MotionSection className="py-16 lg:py-24 border-t border-border">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-20">
          <div className="col-span-full lg:col-span-8 my-auto flex flex-col gap-3">
            <p className="px-2 border border-primary/30 rounded-full bg-primary/10 text-xs font-medium leading-6 text-primary mb-2 w-fit mx-auto lg:mx-0">
              Why choose us?
            </p>

            <h2 className="font-serif text-4xl text-foreground font-bold text-center lg:text-start">
              At Homemade Brownies, every batch is crafted with care and
              attention
            </h2>

            <p className="text-xl font-normal leading-8 text-muted-foreground text-center xl:text-start">
              We use only the finest ingredients — rich chocolates and fresh
              butter — to create brownies that melt in your mouth. Whether
              you're treating yourself or sharing with loved ones, our brownies
              are made to bring joy to every occasion.
            </p>

            <div className="w-full">
              <Button asChild size="lg" className="group w-full lg:w-max">
                <Link href="/about" className="flex items-center gap-2">
                  About Us
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="border-t border-border pt-8 flex items-center gap-11 mt-8">
              {aboutStats.map((stat, index) => {
                const IconComponent = stat.icon;
                const statItem = stat as AboutStatItem & {
                  numberSuffix?: string;
                  animateNumber?: boolean;
                };
                return (
                  <div key={index} className="flex flex-col gap-0.5">
                    <div className="text-xl font-semibold leading-8 text-foreground flex items-center gap-2">
                      <IconComponent
                        className="h-5 w-5 text-primary"
                        strokeWidth={1.5}
                      />
                      {statItem.animateNumber &&
                      typeof statItem.number === "number" ? (
                        <>
                          <AnimatedNumber value={statItem.number} />
                          {statItem.numberSuffix}
                        </>
                      ) : (
                        String(statItem.number)
                      )}
                    </div>
                    <h3 className="text-lg font-normal leading-8 text-muted-foreground">
                      {statItem.label}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-4">
            <Image
              src="/illustrations/cooking.svg"
              alt="Cooking illustration"
              width={400}
              height={400}
              className="w-full h-full object-contain"
              priority={false}
            />
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
