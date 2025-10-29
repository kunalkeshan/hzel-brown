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
  ],
  preview: {
    select: {
      title: "title",
      media: "thumbnail",
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },
});
