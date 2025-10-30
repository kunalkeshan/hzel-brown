import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NuqsAdapter>
        <Navbar />
        {children}
        <Footer />
        <Toaster richColors />
      </NuqsAdapter>
    </>
  );
}
