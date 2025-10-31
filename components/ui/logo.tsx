import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Route } from "next";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  href?: Route;
  width?: number;
  height?: number;
  priority?: boolean;
  alt?: string;
}

export function Logo({
  className,
  imageClassName,
  href = "/",
  width = 165,
  height = 165,
  priority = false,
  alt = "Logo",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center aspect-square", className)}
      prefetch={false}
    >
      <Image
        src="/assets/logo-text.png"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("w-16 h-auto", imageClassName)}
      />
    </Link>
  );
}
