"use client";

import { motion } from "motion/react";
import { Percent, Truck, Gift } from "lucide-react";
import { MotionSection } from "@/components/ui/motion-section";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/numbers";

type StatsProps = {
  freeShippingThreshold?: number;
};

export function Stats({ freeShippingThreshold = 3000 }: StatsProps) {
  const statsData = [
    {
      icon: Percent,
      number: 15,
      numberSuffix: "% Off",
      label: "Bulk Order",
      animateNumber: true,
    },
    {
      icon: Truck,
      number: "Free Shipping",
      label: `Over ${formatCurrency(freeShippingThreshold)}`,
      animateNumber: false,
    },
    {
      icon: Gift,
      number: "Custom Boxes",
      label: "for Events",
      animateNumber: false,
    },
  ] as const;

  type StatItem = (typeof statsData)[number];
  return (
    <MotionSection className="py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-[3fr_7fr] gap-14">
          {/* Text Content */}
          <div className="flex flex-col gap-3">
            <p className="px-2 border border-primary/30 rounded-full bg-primary/10 text-xs font-medium leading-6 text-primary mb-2 w-fit mx-auto xl:mx-0">
              Our Promise
            </p>
            <h2 className="text-4xl font-bold text-foreground font-serif text-center xl:text-start">
              Sweet Deals & Premium Service
            </h2>
            <p className="text-xl font-normal leading-8 text-muted-foreground text-center xl:text-start">
              From bulk discounts to custom packaging, we make every order
              special with unbeatable offers and personalized service.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              const statItem = stat as StatItem & {
                numberSuffix?: string;
                animateNumber?: boolean;
              };
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="flex flex-col gap-6 p-5 items-center lg:items-start">
                      <div className="flex justify-start">
                        <IconComponent
                          className="h-10 w-10 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <CardTitle className="text-xl font-bold text-foreground">
                          {statItem.animateNumber &&
                          typeof statItem.number === "number" ? (
                            <>
                              <AnimatedNumber value={statItem.number} />
                              {statItem.numberSuffix}
                            </>
                          ) : (
                            String(statItem.number)
                          )}
                        </CardTitle>
                        <CardDescription className="text-lg font-normal leading-8">
                          {statItem.label}
                        </CardDescription>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
