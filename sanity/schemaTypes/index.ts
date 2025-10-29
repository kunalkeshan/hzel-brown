import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { faqsType } from "./faqsType";
import { legalType } from "./legalType";
import { menuCategoryType } from "./menuCategoryType";
import { siteConfigType } from "./siteConfigType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    faqsType,
    legalType,
    menuCategoryType,
    siteConfigType,
  ],
};
