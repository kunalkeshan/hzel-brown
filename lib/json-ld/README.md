# JSON-LD Structured Data Implementation

This directory contains type-safe JSON-LD schema generators for SEO and search engine optimization.

## Table of Contents

- [What is JSON-LD?](#what-is-json-ld)
- [Why We Use It](#why-we-use-it)
- [Schemas Implemented](#schemas-implemented)
- [File Structure](#file-structure)
- [How to Use](#how-to-use)
- [Testing & Validation](#testing--validation)
- [Future Enhancements](#future-enhancements)
- [Resources](#resources)

---

## What is JSON-LD?

**JSON-LD** (JavaScript Object Notation for Linked Data) is a method of encoding structured data in a JSON format that search engines can understand. It helps Google, Bing, and other search engines better understand your website content.

**Format:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Chocolate Brownie",
  "price": "250"
}
```

---

## Why We Use It

### Benefits:

1. **Rich Search Results**: Enables features like product cards, star ratings, price displays
2. **Better SEO**: Helps search engines understand content context
3. **Sitelinks Search Box**: Google can show a search box in search results
4. **Knowledge Graph**: Improves your business presence in Google's knowledge panel
5. **Voice Search**: Better structured data improves voice assistant responses

### Real Impact:

- ✅ Products show with images, prices, and availability in Google Search
- ✅ Business info appears correctly in Google Maps and Search
- ✅ FAQs can appear as expandable rich results
- ✅ Better click-through rates (CTR) from search results

**📚 Learn More:**
- [Google's Structured Data Guide](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org Documentation](https://schema.org/)

---

## Schemas Implemented

### 1. **Organization (Bakery)** 📍
**File:** `organization.ts`
**Where:** Root layout (`app/(static)/layout.tsx`)
**Type:** `https://schema.org/Bakery`

**What it does:**
Tells search engines about your business - name, location, contact info, service area, social media.

**Why it's important:**
- Powers Google Business Profile integration
- Enables "near me" searches
- Shows business info in knowledge panel
- Improves local SEO

**Data included:**
- Business name & description
- Logo & images
- Physical address (validated - only included if populated)
- Phone numbers & emails (contact points)
- Social media profiles
- Service area (Tamil Nadu)
- Payment methods (Cash, Cards, UPI)
- Price range indicator (₹₹)

**📚 Schema Reference:**
- [Bakery Schema](https://schema.org/Bakery)
- [FoodEstablishment](https://schema.org/FoodEstablishment)
- [LocalBusiness Best Practices](https://developers.google.com/search/docs/appearance/structured-data/local-business)

---

### 2. **WebSite** 🔍
**File:** `website.ts`
**Where:** Root layout (`app/(static)/layout.tsx`)
**Type:** `https://schema.org/WebSite`

**What it does:**
Defines your website metadata and enables Google's sitelinks search box feature.

**Why it's important:**
- Enables search box in Google search results
- Users can search your site directly from Google
- Improves site navigation from search engines

**SearchAction explained:**
```typescript
potentialAction: {
  "@type": "SearchAction",
  target: "/menu?search={search_term_string}",
  "query-input": "required name=search_term_string"
}
```

This tells Google:
- You have search functionality at `/menu?search=...`
- Google can show a search box in search results
- User searches go directly to your menu page with results

**Implementation:**
- Search uses `nuqs` library for URL state management
- Query param: `?search={query}` (e.g., `/menu?search=chocolate`)
- Filters menu items in real-time

**📚 Schema Reference:**
- [WebSite Schema](https://schema.org/WebSite)
- [Sitelinks Searchbox](https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox)

---

### 3. **Product** 🍰
**File:** `product.ts`
**Where:** Menu item pages (`app/(static)/menu/[category]/[item]/page.tsx`)
**Type:** `https://schema.org/Product`

**What it does:**
Describes individual bakery products (brownies, cookies, cakes, etc.) with pricing, availability, and details.

**Why it's important:**
- Products appear with images and prices in Google Search
- Shows stock availability (In Stock / Out of Stock)
- Enables Google Shopping integration
- Rich product cards in search results

**Data included:**
- Product name & description
- High-quality image (1200x1200)
- Category (dynamically from CMS)
- Price in INR (Indian Rupees)
- Availability status
- Allergen information (as additional properties)
- Ingredients list (as additional properties)
- Combo details (if applicable)
- Seller information (your business)

**Offer structure:**
```typescript
offers: {
  "@type": "Offer",
  price: "250.00",
  priceCurrency: "INR",
  availability: "https://schema.org/InStock",
  seller: { "@type": "Organization", name: "Hzel Brown" }
}
```

**Future enhancement (TODO):**
- Reviews & ratings (`aggregateRating`)
- When review system is implemented, uncomment lines 104-109

**📚 Schema Reference:**
- [Product Schema](https://schema.org/Product)
- [Product Structured Data Guide](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Offer Schema](https://schema.org/Offer)

---

### 4. **FAQPage** ❓
**File:** `faq.ts`
**Where:** Homepage (`app/(static)/page.tsx`)
**Type:** `https://schema.org/FAQPage`

**What it does:**
Marks up FAQ questions and answers for rich results in search.

**Why it's important:**
- FAQs can appear as expandable results in Google
- Increases search result real estate
- Directly answers user questions
- Improves CTR

**Example rich result:**
```
Hzel Brown - Bakery
https://yourdomain.com
▼ Do you deliver across Tamil Nadu?
  Yes, we deliver fresh brownies...
▼ What allergens do your products contain?
  Our products may contain...
```

**Data included:**
- All FAQ questions from CMS
- Corresponding answers
- Automatically filters out incomplete FAQs

**📚 Schema Reference:**
- [FAQPage Schema](https://schema.org/FAQPage)
- [FAQ Structured Data Guide](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

---

## File Structure

```
lib/json-ld/
├── README.md                    # This file - documentation
├── utils.ts                     # Helper functions
│   ├── sanitizeJsonLd()        # XSS-safe JSON serialization
│   ├── createAbsoluteUrl()     # URL formatting
│   ├── formatPrice()           # Price formatting for schema
│   └── getAvailability()       # Stock status conversion
├── organization.ts              # Bakery/Business schema
├── website.ts                   # Website + SearchAction schema
├── product.ts                   # Product/Offer schema
└── faq.ts                       # FAQPage schema

components/json-ld/
└── json-ld-script.tsx          # Reusable script component
```

---

## How to Use

### Adding a New Schema

1. **Create schema generator** in `lib/json-ld/your-schema.ts`:
```typescript
import type { WithContext, YourType } from "schema-dts";

export function generateYourSchema(data): WithContext<YourType> {
  return {
    "@context": "https://schema.org",
    "@type": "YourType",
    // ... your fields
  };
}
```

2. **Import in your page/layout:**
```typescript
import { JsonLdScript } from "@/components/json-ld/json-ld-script";
import { generateYourSchema } from "@/lib/json-ld/your-schema";

export default function YourPage() {
  const schema = generateYourSchema(data);

  return (
    <>
      <JsonLdScript data={schema} />
      {/* Your page content */}
    </>
  );
}
```

### Updating Existing Schemas

Example: Adding business hours to Organization schema:

```typescript
// lib/json-ld/organization.ts
const schema: WithContext<Bakery> = {
  // ... existing fields
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00"
  }
};
```

**Remember:**
- All data should come from CMS (`types/cms.d.ts`)
- Use helper functions from `utils.ts`
- Always validate data before including
- Test with Google Rich Results Test

---

## Testing & Validation

### 1. **Local Testing**
```bash
pnpm dev
# Visit any page, view source (Ctrl+U)
# Search for: <script type="application/ld+json">
```

### 2. **Google Rich Results Test**
🔗 https://search.google.com/test/rich-results

**Test these pages:**
- Homepage: Organization, WebSite, FAQPage schemas
- Product page: Product schema
- Category page: ItemList schema (if implemented)

### 3. **Schema Markup Validator**
🔗 https://validator.schema.org/

Paste your page HTML or URL for detailed validation.

### 4. **Google Search Console**

After deployment:
1. Go to Search Console
2. Navigate to "Enhancements"
3. Check for:
   - Products
   - FAQs
   - Sitelinks searchbox
   - Organization

---

## Future Enhancements

### Planned (TODOs in code):

1. **Review System** (`product.ts:104-109`)
   ```typescript
   aggregateRating: {
     "@type": "AggregateRating",
     ratingValue: "4.5",
     reviewCount: "24"
   }
   ```

2. **Business Hours** (`organization.ts`)
   - Add opening hours to CMS
   - Include `openingHoursSpecification`

3. **BreadcrumbList Schema**
   - Navigation breadcrumbs
   - Improves site structure understanding

4. **ItemList Schema**
   - Category/menu pages
   - List of products in each category

5. **Recipe Schema**
   - If you add baking recipes to blog/content
   - Step-by-step instructions with images

### Suggestions:

- **Video Schema**: If you add product videos
- **Event Schema**: For special promotions/events
- **BlogPosting**: If you add a blog section

---

## Security & Best Practices

### XSS Protection

All JSON-LD is sanitized using `sanitizeJsonLd()`:
```typescript
// Replaces dangerous characters:
"<" → "\\u003c"
">" → "\\u003e"
"&" → "\\u0026"
```

**Why:** Prevents HTML/script injection when embedding JSON in `<script>` tags.

### Data Validation

✅ **Do:**
- Validate fields exist before including
- Use spread operators for optional fields
- Filter out null/empty values
- Check arrays have length before mapping

❌ **Don't:**
- Include empty objects (e.g., address with only `@type`)
- Leave undefined values in schema
- Include invalid URLs or prices

### Type Safety

All schemas use `schema-dts` for TypeScript validation:
```typescript
import type { WithContext, Product } from "schema-dts";

const schema: WithContext<Product> = {
  // TypeScript validates all fields
};
```

---

## Resources

### Official Documentation
- [Schema.org](https://schema.org/) - Official schema reference
- [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data) - Google's structured data guide
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Next.js implementation

### Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Test your markup
- [Schema Markup Validator](https://validator.schema.org/) - Validate schema
- [Google Search Console](https://search.google.com/search-console) - Monitor performance

### Libraries
- [schema-dts](https://github.com/google/schema-dts) - TypeScript definitions (v1.1.5)
- [nuqs](https://nuqs.47ng.com/) - URL state management for search

### Learning
- [Understanding JSON-LD](https://json-ld.org/) - JSON-LD specification
- [Structured Data Codelab](https://codelabs.developers.google.com/codelabs/structured-data) - Hands-on tutorial
- [Schema.org Getting Started](https://schema.org/docs/gs.html) - Beginner guide

---

## Maintenance

### When to Update

1. **Business Info Changes:**
   - Update `organization.ts` if address, phone, or hours change
   - CMS changes automatically reflect (no code needed)

2. **New Products:**
   - Product schema automatically generated from CMS
   - No code changes needed

3. **Schema.org Updates:**
   - Monitor [Schema.org releases](https://schema.org/docs/releases.html)
   - Update `schema-dts` package periodically:
     ```bash
     pnpm update schema-dts
     ```

4. **Google Guidelines Change:**
   - Subscribe to [Google Search Central Blog](https://developers.google.com/search/blog)
   - Review structured data updates

### Support

**Questions or issues?**
- Check [Google Search Central community](https://support.google.com/webmasters/community)
- Review [schema-dts issues](https://github.com/google/schema-dts/issues)
- Test with validation tools above

---

**Last Updated:** November 2025
**Version:** 1.0.0
**Maintainer:** Development Team
