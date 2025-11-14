import { defineQuery } from "next-sanity";

/**
 * Unified search query for command menu
 * Searches across categories, menu items, and legal documents
 *
 * @param searchTerm - The search term to match against
 * @returns Object with categories, menuItems, and legal arrays
 */
export const COMMAND_SEARCH_QUERY = defineQuery(`{
  "categories": *[
    _type == "menuCategory" &&
    (title match $searchTerm || description match $searchTerm)
  ] | order(title asc) [0...10] {
    _id,
    title,
    slug,
    description
  },

  "menuItems": *[
    _type == "menuItem" &&
    isAvailable == true &&
    (name match $searchTerm || description match $searchTerm)
  ] | order(name asc) [0...10] {
    _id,
    name,
    slug,
    price,
    categories[]-> {
      slug
    },
    isAvailable
  },

  "legal": *[
    _type == "legal" &&
    (title match $searchTerm || description match $searchTerm)
  ] | order(title asc) [0...10] {
    _id,
    title,
    slug,
    description
  }
}`);
