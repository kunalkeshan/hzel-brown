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
      S.listItem()
        .title("Menu")
        .child(
          S.list()
            .title("Menu Management")
            .items([
              S.documentTypeListItem("menuCategory").title("Categories"),
              S.listItem()
                .title("Items by Category")
                .child(
                  S.documentTypeList("menuCategory")
                    .title("Categories")
                    .child((categoryId) =>
                      S.documentList()
                        .title("Menu Items")
                        .filter(
                          '_type == "menuItem" && $categoryId in categories[]._ref'
                        )
                        .params({ categoryId })
                    )
                ),
              S.documentTypeListItem("menuItem").title("All Items"),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["faqs", "siteConfig", "legal", "menuCategory", "menuItem"].includes(
            item.getId()!
          )
      ),
    ]);
