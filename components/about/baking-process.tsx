import {
  ShoppingBasket,
  Scale,
  Utensils,
  Flame,
  Thermometer,
  Package,
  Sparkles,
} from "lucide-react";
import { MotionSection } from "../ui/motion-section";

const steps = [
  {
    icon: ShoppingBasket,
    title: "Selecting Ingredients",
    description:
      "We start by choosing only the freshest, high-quality ingredients — rich cocoa, pure butter, and premium flour.",
  },
  {
    icon: Scale,
    title: "Measuring with Care",
    description:
      "Every ingredient is measured precisely to maintain the perfect balance of flavor and texture in every batch.",
  },
  {
    icon: Utensils,
    title: "Mixing the Batter",
    description:
      "Our batter is mixed slowly and evenly to lock in that fudgy, melt-in-your-mouth goodness.",
  },
  {
    icon: Flame,
    title: "Baking in Small Batches",
    description:
      "Each batch is baked to perfection in small quantities to ensure consistency and that signature homemade taste.",
  },
  {
    icon: Thermometer,
    title: "Cooling and Checking",
    description:
      "Once baked, the cookies are cooled naturally and checked for perfect texture and quality.",
  },
  {
    icon: Package,
    title: "Packing with Love",
    description:
      "Finally, every cookie is packed carefully to stay fresh and delicious when it reaches you.",
  },
];

export default function BakingProcess() {
  return (
    <MotionSection className="py-16 lg:pt-40">
      <div className="container space-y-8 md:space-y-16">
        <div className="relative z-10 mx-auto space-y-6 text-center lg:text-start md:space-y-12">
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
            Baking Process - Home-Baked Goodness
          </h1>

          <p className="text-lg font-medium sm:text-xl/8">
            From carefully selected ingredients to thoughtful packing,
            here&apos;s how we craft our home-baked cookies — consistent, fresh,
            and made with love.
          </p>
        </div>

        <div className="relative mx-auto grid divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="size-4" />
                <h2 className="text-sm font-medium">{title}</h2>
              </div>
              <p className="text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
