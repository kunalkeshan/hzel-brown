import { LemonIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const ingredientType = defineType({
	name: "ingredient",
	title: "Ingredient",
	type: "document",
	icon: LemonIcon,
	fields: [
		defineField({
			name: "name",
			title: "Ingredient Name",
			type: "string",
			validation: (Rule) => Rule.required(),
			description: "The name of the ingredient (e.g., Tomato, Cheese, Basil)",
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: {
				source: "name",
			},
			validation: (Rule) => Rule.required(),
			description: "Auto-generated URL-friendly identifier",
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
			description: "Optional description of the ingredient (e.g., sourcing, preparation notes)",
		}),
	],
	preview: {
		select: {
			title: "name",
			subtitle: "description",
		},
		prepare({ title, subtitle }) {
			return {
				title,
				subtitle: subtitle || "Ingredient",
			};
		},
	},
});
