import { defineQuery } from "next-sanity";

export const MENU_ITEMS_QUERY = defineQuery(`
  *[_type == "menuItem" && isAvailable == true] | order(name asc) {
    _id,
    name,
    slug,
    description,
    price,
    ingredients[]-> {
      _id,
      name,
      slug
    },
    allergens,
    isAvailable,
    isCombo,
    comboDescription,
    _createdAt,
    _updatedAt,
    comboItems[]-> {
      _id,
      name,
      slug,
      price,
      isAvailable,
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
    },
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
    ingredients[]-> {
      _id,
      name,
      slug
    },
    allergens,
    isAvailable,
    isCombo,
    comboDescription,
    _createdAt,
    _updatedAt,
    comboItems[]-> {
      _id,
      name,
      slug,
      price,
      isAvailable,
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
    },
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
    description,
    _createdAt,
    _updatedAt
  }
`);

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "siteConfig"][0].menuCategories[]-> {
    _id,
    title,
    slug,
    description,
    thumbnail {
      asset->,
      alt,
      hotspot,
      crop
    }
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

export const MENU_ITEM_BY_SLUGS_QUERY = defineQuery(`
  {
    "item": *[_type == "menuItem" && slug.current == $itemSlug && $categorySlug in categories[]->slug.current][0] {
      _id,
      name,
      slug,
      description,
      price,
      ingredients[]-> {
        _id,
        name,
        slug
      },
      allergens,
      isAvailable,
      isCombo,
      comboDescription,
      _createdAt,
      _updatedAt,
      comboItems[]-> {
        _id,
        name,
        slug,
        price,
        isAvailable,
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
      },
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
    },
    "relatedItems": *[_type == "menuItem" && slug.current != $itemSlug && $categorySlug in categories[]->slug.current && isAvailable == true] | order(name asc) [0...4] {
      _id,
      name,
      slug,
      description,
      price,
      ingredients[]-> {
        _id,
        name,
        slug
      },
      allergens,
      isAvailable,
      isCombo,
      comboDescription,
      _createdAt,
      _updatedAt,
      comboItems[]-> {
        _id,
        name,
        slug,
        price,
        isAvailable,
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
      },
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
  }
`);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "menuCategory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    thumbnail {
      asset->,
      alt
    },
    featuredItems[]-> {
      _id,
      name,
      slug,
      description,
      price,
      ingredients[]-> {
        _id,
        name,
        slug
      },
      allergens,
      isAvailable,
      isCombo,
      comboDescription,
      _createdAt,
      _updatedAt,
      comboItems[]-> {
        _id,
        name,
        slug,
        price,
        isAvailable,
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
      },
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
  }
`);

export const MENU_ITEMS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "menuItem" && $categorySlug in categories[]->slug.current] | order(name asc) {
    _id,
    name,
    slug,
    description,
    price,
    ingredients[]-> {
      _id,
      name,
      slug
    },
    allergens,
    isAvailable,
    isCombo,
    comboDescription,
    _createdAt,
    _updatedAt,
    comboItems[]-> {
      _id,
      name,
      slug,
      price,
      isAvailable,
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
    },
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

export const MENU_ITEMS_BY_INGREDIENT_QUERY = defineQuery(`
  *[_type == "menuItem" && references($ingredientId)] {
    _id,
    "slug": slug.current
  }
`);
