import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
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
      <Navbar />
      {children}
      <Footer />
      <Toaster richColors />
    </>
  );
}
