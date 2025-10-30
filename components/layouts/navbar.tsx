"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { MobileNav } from "./mobile-nav";
import { navigationItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface DropdownState {
  [key: string]: boolean;
}

export function Navbar() {
  const pathname = usePathname();
  const [dropdownState, setDropdownState] = useState<DropdownState>({});
  const dropdownRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  // Function to check if a navigation item is active
  const isActiveNavItem = (item: (typeof navigationItems)[0]): boolean => {
    // For exact matches (Home page)
    if (item.href === "/" && pathname === "/") {
      return true;
    }

    // For other pages, check if current path starts with the item's href
    if (item.href && item.href !== "/") {
      if (pathname.startsWith(item.href)) {
        return true;
      }
    }

    // For items with children, check if any child matches the current path
    if (item.children) {
      return item.children.some((child) => {
        if (child.href === pathname) return true;
        // Handle hash links by checking base path
        if (child.href?.includes("#")) {
          const basePath = child.href.split("#")[0];
          return pathname === basePath || pathname.startsWith(basePath + "/");
        }
        // Check if current path starts with child href
        return child.href && pathname.startsWith(child.href);
      });
    }

    return false;
  };

  const toggleDropdown = (dropdown: string) => {
    setDropdownState((prev) => {
      const newState: DropdownState = {};
      const hasDropdown = Object.prototype.hasOwnProperty.call(prev, dropdown);
      Object.keys(prev).forEach((key) => {
        newState[key] = key === dropdown ? !prev[key] : false;
      });
      if (!hasDropdown) {
        newState[dropdown] = true;
      }
      return newState;
    });
  };

  const closeAllDropdowns = () => {
    setDropdownState({});
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        (ref) => !ref?.contains(event.target as Node)
      );
      if (clickedOutside) {
        closeAllDropdowns();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav className="py-5 lg:fixed transition-all top-0 left-0 z-50 duration-500 w-full bg-background border-b border-border px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="flex justify-between lg:flex-row">
            <Logo priority alt="Hezl Brown" />
            <MobileNav />
          </div>

          <div className="hidden w-full lg:flex lg:pl-11 max-lg:mt-1">
            <ul className="flex lg:items-center lg:justify-center flex-col gap-4 max-lg:pt-4 max-lg:mb-4 lg:mt-0 lg:flex-row lg:mr-auto">
              {navigationItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const dropdownKey = item.label.toLowerCase();

                if (hasChildren) {
                  return (
                    <li
                      key={item.label}
                      className="relative"
                      ref={(el) => {
                        dropdownRefs.current[dropdownKey] = el;
                      }}
                    >
                      <button
                        onClick={() => toggleDropdown(dropdownKey)}
                        className={cn(
                          "flex items-center justify-between text-center text-base font-medium hover:text-primary transition-all duration-500 mb-2 lg:mr-6 lg:mb-0 mr-auto lg:text-left relative",
                          isActiveNavItem(item)
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                        aria-expanded={dropdownState[dropdownKey] || false}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 ml-1.5 transition-transform duration-200",
                            dropdownState[dropdownKey] && "rotate-180"
                          )}
                        />
                        {isActiveNavItem(item) && (
                          <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary transition-all duration-300" />
                        )}
                      </button>

                      <AnimatePresence>
                        {dropdownState[dropdownKey] && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-14 bg-card rounded-lg shadow-lg w-64 p-8 z-50"
                          >
                            <motion.ul
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              variants={{
                                visible: {
                                  transition: {
                                    staggerChildren: 0.05,
                                  },
                                },
                                hidden: {
                                  transition: {
                                    staggerChildren: 0.02,
                                    staggerDirection: -1,
                                  },
                                },
                              }}
                            >
                              {item.children?.map((childItem) => (
                                <motion.li
                                  key={childItem.label}
                                  variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0 },
                                  }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                  }}
                                >
                                  <Link
                                    href={childItem.href || "#"}
                                    className="block py-3 hover:text-primary text-base text-foreground font-semibold transition-all duration-500"
                                    onClick={closeAllDropdowns}
                                    prefetch={false}
                                  >
                                    {childItem.label}
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                return (
                  <li key={item.label} className="relative">
                    <Link
                      href={item.href || "#"}
                      className={cn(
                        "nav-link mb-2 block lg:mr-6 lg:mb-0 lg:text-left text-base font-medium transition-all duration-500 hover:text-primary relative",
                        isActiveNavItem(item)
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                      prefetch={false}
                    >
                      {item.label}
                      {isActiveNavItem(item) && (
                        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary transition-all duration-300" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex lg:items-center w-full justify-start flex-col lg:flex-row gap-4 lg:w-max max-lg:gap-4 lg:ml-14 lg:justify-end">
              <Link
                href="/cart"
                className="text-muted-foreground hover:text-primary transition-colors relative"
              >
                <ShoppingCart className="w-6 h-6 shrink-0" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
                  3
                </Badge>
                <span className="sr-only">Shopping Cart (3 items)</span>
              </Link>
              <Button asChild>
                <Link href="/contact" prefetch={false}>
                  Order Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
