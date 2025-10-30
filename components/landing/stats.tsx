import { Percent, Truck, Gift } from "lucide-react";
import { MotionSection } from "@/components/ui/motion-section";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statsData = [
  {
    icon: Percent,
    number: "15% Off",
    label: "Bulk Order",
  },
  {
    icon: Truck,
    number: "Free Shipping",
    label: "Over ₹3,000",
  },
  {
    icon: Gift,
    number: "Custom Boxes",
    label: "for Events",
  },
];

export function Stats() {
  return (
    <MotionSection className="py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-14">
          {/* Text Content */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-normal leading-6 text-primary mb-2 text-center xl:text-start">
              Why Choose Us
            </h3>
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
              return (
                <Card
                  key={index}
                  className="hover:-translate-y-1 transition-all duration-300"
                >
                  <CardContent className="flex flex-col gap-6 p-5">
                    <div className="flex justify-start">
                      <IconComponent
                        className="h-10 w-10 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <CardTitle className="text-xl font-bold text-foreground">
                        {stat.number}
                      </CardTitle>
                      <CardDescription className="text-lg font-normal leading-8">
                        {stat.label}
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
