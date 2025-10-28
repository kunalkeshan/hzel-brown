import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

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
      {children}
      <Toaster richColors />
    </>
  );
}
