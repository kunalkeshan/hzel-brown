import { defineQuery } from "next-sanity";

export const SITE_CONFIG_QUERY = defineQuery(`
  *[_type == "siteConfig"][0] {
    _id,
    title,
    description,
    ogImage {
      asset->,
      alt
    },
    twitterImage {
      asset->,
      alt
    },
    phoneNumbers[] {
      number,
      label
    },
    emails[] {
      email,
      label
    },
    address {
      street,
      city,
      state,
      postalCode,
      country
    },
    socialMedia[] {
      platform,
      url,
      label
    },
    featuredMenuItems[]-> {
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
    heroImages[] {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`);

export const FOOTER_LEGAL_LINKS_QUERY = defineQuery(`
  *[_type == "siteConfig"][0].footerLegalLinks[]-> {
    _id,
    title,
    slug,
    description,
    _updatedAt
  }
`);
