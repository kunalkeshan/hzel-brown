import { defineQuery } from "next-sanity";

export const MENU_ITEMS_QUERY = defineQuery(`
  *[_type == "menuItem" && isAvailable == true] | order(name asc) {
    _id,
    name,
    slug,
    description,
    price,
    ingredients,
    allergens,
    isAvailable,
    isCombo,
    comboDescription,
    categories[]-> {
      _id,
      title,
      slug
    },
    image {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`);

export const ALL_MENU_ITEMS_QUERY = defineQuery(`
  *[_type == "menuItem"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    price,
    ingredients,
    allergens,
    isAvailable,
    isCombo,
    comboDescription,
    categories[]-> {
      _id,
      title,
      slug
    },
    image {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`);

export const MENU_CATEGORIES_QUERY = defineQuery(`
  *[_type == "menuCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`);

export const MENU_FILTERS_DATA_QUERY = defineQuery(`
  {
    "categories": *[_type == "menuCategory"] | order(title asc) {
      _id,
      title,
      slug
    },
    "allergens": array::unique(*[_type == "menuItem" && defined(allergens)].allergens[]),
    "priceRange": {
      "min": math::min(*[_type == "menuItem" && defined(price)].price),
      "max": math::max(*[_type == "menuItem" && defined(price)].price)
    }
  }
`);
