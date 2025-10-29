import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const menuCategoryType = defineType({
  name: "menuCategory",
  title: "Menu Category",
  type: "document",
  icon: TagIcon,
  groups: [
    {
      name: "basic",
      title: "Basic Information",
      default: true,
    },
    {
      name: "media",
      title: "Media & Images",
    },
    {
      name: "related",
      title: "Related Items",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Category Title",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "basic",
      options: {
        source: "title",
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
      name: "thumbnail",
      title: "Thumbnail Image",
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
    defineField({
      name: "featuredItems",
      title: "Featured Menu Items",
      type: "array",
      group: "related",
      of: [
        {
          type: "reference",
          to: [{ type: "menuItem" }],
          options: {
            filter: ({ document }) => {
              // Only show menu items that belong to this category
              if (!document._id) return {};
              return {
                filter: "references($categoryId) in categories[]._ref",
                params: { categoryId: document._id },
              };
            },
          },
        },
      ],
      description:
        "Select featured items for this category (optional - items are automatically linked when their category field is set)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "thumbnail",
      description: "description",
    },
    prepare({ title, media, description }) {
      return {
        title,
        subtitle: description || "Menu Category",
        media,
      };
    },
  },
});
