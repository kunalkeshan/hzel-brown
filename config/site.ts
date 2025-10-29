import { assertValue } from "@/lib/utils";

export const SITE_CONFIG = {
  URL: assertValue(
    process.env.SITE_URL,
    "Missing environment variable: SITE_URL"
  ),
};
