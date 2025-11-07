import BakingProcess from "@/components/about/baking-process";
import { Categories } from "@/components/about/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "We use only the finest ingredients — rich chocolates and fresh butter — to create brownies that melt in your mouth. Whether you're treating yourself or sharing with loved ones, our brownies are made to bring joy to every occasion.",
};

export default function AboutPage() {
  return (
    <main>
      <BakingProcess />
      <Categories />
    </main>
  );
}
