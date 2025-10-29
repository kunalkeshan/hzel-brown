import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const menuItemType = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  icon: TagIcon,
  groups: [
    {
      name: "basic",
      title: "Basic Information",
      default: true,
    },
    {
      name: "details",
      title: "Item Details",
    },
    {
      name: "combo",
      title: "Combo Settings",
    },
    {
      name: "media",
      title: "Media & Images",
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Item Name",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "basic",
      options: {
        source: "name",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "basic",
      rows: 3,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "basic",
      of: [
        {
          type: "reference",
          to: [{ type: "menuCategory" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: "Select one or more categories this item belongs to",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "details",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      description: "List of ingredients used in this item",
    }),
    defineField({
      name: "allergens",
      title: "Allergens",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      description: "Common allergens present in this item",
      options: {
        list: [
          { title: "Gluten", value: "gluten" },
          { title: "Dairy", value: "dairy" },
          { title: "Nuts", value: "nuts" },
          { title: "Eggs", value: "eggs" },
          { title: "Soy", value: "soy" },
          { title: "Sesame", value: "sesame" },
        ],
      },
    }),
    defineField({
      name: "isAvailable",
      title: "Available",
      type: "boolean",
      group: "details",
      initialValue: true,
      description: "Is this item currently available?",
    }),
    defineField({
      name: "isCombo",
      title: "Is Combo Item",
      type: "boolean",
      group: "combo",
      initialValue: false,
      description: "Check if this is a combination of multiple items",
    }),
    defineField({
      name: "comboItems",
      title: "Combo Items",
      type: "array",
      group: "combo",
      of: [
        {
          type: "reference",
          to: [{ type: "menuItem" }],
          options: {
            filter: ({ document }) => {
              // Don't allow self-reference and don't allow combo items to reference other combo items
              return {
                filter:
                  "_id != $currentId && !defined(isCombo) || isCombo != true",
                params: { currentId: document._id },
              };
            },
          },
        },
      ],
      hidden: ({ document }) => !document?.isCombo,
      validation: (Rule) =>
        Rule.custom((comboItems, context) => {
          const isCombo = (context.document as any)?.isCombo;
          if (isCombo && (!comboItems || comboItems.length === 0)) {
            return "Combo items must reference at least one base item";
          }
          return true;
        }),
      description: "Select the base items that make up this combo",
    }),
    defineField({
      name: "comboDescription",
      title: "Combo Description",
      type: "text",
      group: "combo",
      hidden: ({ document }) => !document?.isCombo,
      description: "Special description for this combo item",
      placeholder:
        "e.g., Perfect blend of brownie and cookie in one delicious treat",
    }),
    defineField({
      name: "image",
      title: "Item Image",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      price: "price",
      media: "image",
      categories: "categories",
      isCombo: "isCombo",
      isAvailable: "isAvailable",
    },
    prepare({ title, price, media, categories, isCombo, isAvailable }) {
      const categoryNames =
        categories?.map((cat: any) => cat.title).join(", ") || "";
      const status = !isAvailable ? " (Unavailable)" : "";
      const comboLabel = isCombo ? " 🔗" : "";

      return {
        title: `${title}${comboLabel}${status}`,
        subtitle: `₹${price} • ${categoryNames}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Price Low-High",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
  ],
});
