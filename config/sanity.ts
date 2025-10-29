import { assertValue } from "@/lib/utils";

export const SANITY_CONFIG = {
  PROJECT_ID: assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
  ),
  DATASET: assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
  ),
  API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-09-22",
  USE_CDN: process.env.NODE_ENV === "production",
} as const;

export const isSanityConfigured = () => {
  return !!(SANITY_CONFIG.PROJECT_ID && SANITY_CONFIG.DATASET);
};
