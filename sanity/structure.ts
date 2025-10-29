import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Hezl Brown")
    .items([
      S.listItem()
        .title("Site Configuration")
        .child(S.document().schemaType("siteConfig").documentId("siteConfig")),
      S.documentTypeListItem("legal").title("Legal Documents"),
      S.listItem()
        .title("FAQs")
        .child(S.document().schemaType("faqs").documentId("faqs")),
      S.divider(),
      // S.documentTypeListItem("city").title("Destinations"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            // "city",
            // "country",
            // "state",
            // "attraction",
            // "attractionCategory",
            // "hotel",
            // "tourPackage",
            // "packageCategory",
            "faqs",
            "siteConfig",
            "legal",
          ].includes(item.getId()!)
      ),
    ]);
