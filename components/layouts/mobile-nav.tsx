"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { navigationItems } from "@/constants/navigation";
import { Logo } from "@/components/ui/logo";
import { MenuIcon, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function MobileNav() {
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch - only show cart count after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    // Check if it's an anchor link (contains #)
    if (href.includes("#")) {
      e.preventDefault();
      // Close the sheet first
      if (sheetCloseRef.current) {
        sheetCloseRef.current.click();
      }
      // Small delay to ensure sheet closes, then navigate
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  };

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <Link
        href="/cart"
        className="text-muted-foreground hover:text-primary transition-colors p-2 relative"
      >
        <ShoppingCart className="w-6 h-6" />
        {isMounted && totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
            {totalItems}
          </Badge>
        )}
        <span className="sr-only">
          Shopping Cart ({isMounted ? totalItems : 0} items)
        </span>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden p-2 text-muted-foreground hover:bg-accent"
            aria-label="Open main menu"
          >
            <MenuIcon className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-sm p-6 overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Logo width={120} height={24} alt="Company Logo" />
            </div>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            {/* Hidden SheetClose button for programmatic access */}
            <SheetClose ref={sheetCloseRef} className="hidden" />
          </SheetHeader>

          <div className="flex flex-col gap-4">
            <nav className="flex flex-col gap-2">
              <Accordion type="single" collapsible className="w-full">
                {navigationItems.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;

                  if (hasChildren) {
                    return (
                      <AccordionItem
                        key={item.label}
                        value={item.label.toLowerCase()}
                        className="border-b-0"
                      >
                        <AccordionTrigger className="py-3 px-3 text-base font-medium text-muted-foreground hover:text-muted-foreground/80 hover:no-underline hover:bg-accent rounded-lg transition-colors">
                          {item.label}
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-2">
                          <motion.div
                            className="space-y-1"
                            initial="hidden"
                            animate="visible"
                            variants={{
                              visible: {
                                transition: {
                                  staggerChildren: 0.05,
                                },
                              },
                            }}
                          >
                            {item.children?.map((childItem) => (
                              <motion.div
                                key={childItem.label}
                                variants={{
                                  hidden: { opacity: 0, x: -10 },
                                  visible: { opacity: 1, x: 0 },
                                }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                              >
                                {childItem.href?.includes("#") ? (
                                  <Link
                                    href={childItem.href}
                                    className="block py-3 px-3 text-sm text-muted-foreground font-medium hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                                    onClick={(e) =>
                                      handleLinkClick(childItem.href!, e)
                                    }
                                    prefetch={false}
                                  >
                                    {childItem.label}
                                  </Link>
                                ) : (
                                  <SheetClose asChild>
                                    <Link
                                      href={childItem.href || "#"}
                                      className="block py-3 px-3 text-sm text-muted-foreground font-medium hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                                      prefetch={false}
                                    >
                                      {childItem.label}
                                    </Link>
                                  </SheetClose>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  }

                  return (
                    <div key={item.label}>
                      {item.href?.includes("#") ? (
                        <Link
                          href={item.href}
                          className="block py-3 px-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                          onClick={(e) => handleLinkClick(item.href!, e)}
                          prefetch={false}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            href={item.href || "#"}
                            className="block py-3 px-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                            prefetch={false}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                  );
                })}
              </Accordion>
            </nav>

            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              <SheetClose asChild>
                <Button className="w-full" asChild>
                  <Link href="/contact" prefetch={false}>
                    Order Now
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
