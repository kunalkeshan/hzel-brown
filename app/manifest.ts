import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hzel Brown - Premium Brownies",
    short_name: "Hzel Brown",
    description:
      "We use only the finest ingredients — rich chocolates and fresh butter — to create brownies that melt in your mouth. Whether you're treating yourself or sharing with loved ones, our brownies are made to bring joy to every occasion.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f1e6", // Light theme background from globals.css
    theme_color: "#a67c52", // Light theme primary from globals.css
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
