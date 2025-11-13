# Hzel Brown

An artisan dessert shop e-commerce platform specializing in handcrafted brownies, brookies, cupcakes, and cookies with delivery across Tamil Nadu, India.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [On-Demand Revalidation with Sanity Webhooks](#on-demand-revalidation-with-sanity-webhooks)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)
- [Contact](#contact)

## Features

- **Menu Management**: Browse categorized menu items with detailed information including ingredients, allergens, and pricing
- **E-commerce Functionality**: Shopping cart, item details, and product categorization
- **Content Management**: Fully integrated Sanity CMS for managing products, content, and site configuration
- **Responsive Design**: Mobile-first approach with modern UI components
- **Email Templates**: Integrated React Email for transactional emails
- **Type Safety**: Full TypeScript support with auto-generated types from Sanity schema

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **CMS**: [Sanity](https://www.sanity.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Email**: [React Email](https://react.email/)
- **Animations**: [Motion](https://motion.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v22.x or higher (LTS recommended)
- **pnpm**: v10.x or higher

You can install pnpm globally using:

```bash
npm install -g pnpm@latest
# or using Corepack (recommended)
corepack enable
corepack use pnpm@latest
```

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/kunalkeshan/hzel-brown.git
cd hzel-brown
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Copy the `.env.sample` file to `.env.local` and fill in your environment variables:

```bash
cp .env.sample .env.local
```

See [Environment Variables](#environment-variables) section for details.

4. **Set up Sanity**

If you haven't already set up a Sanity project, you can initialize one using:

```bash
npx sanity@latest init
```

This will guide you through creating a new Sanity project or connecting to an existing one.

For detailed setup instructions, refer to the [next-sanity documentation](https://github.com/sanity-io/next-sanity).

5. **Generate Sanity types**

```bash
pnpm run generate:types
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=your_dataset_name

# Environment
NODE_ENV=development

# Site Configuration
SITE_URL=http://localhost:3000

# Sanity Webhook Secret (required for on-demand revalidation)
# Generate a strong secret and add the same value to your Sanity webhook configuration
SANITY_WEBHOOK_SECRET=your_webhook_secret
```

**Note**: For actual values and additional configuration details, refer to the `.env.sample` file or contact the repository owner.

## Development

To start the development server:

```bash
pnpm dev
```

This will concurrently start:
- **Next.js development server** at [http://localhost:3000](http://localhost:3000)
- **Email preview server** at [http://localhost:3001](http://localhost:3001)

You can also run them individually:

```bash
# Next.js only
pnpm dev:app

# Email preview only
pnpm dev:email
```

### Accessing Sanity Studio

The Sanity CMS admin panel is available at:

```
http://localhost:3000/cms
```

## On-Demand Revalidation with Sanity Webhooks

This application uses **on-demand revalidation** instead of time-based revalidation for optimal performance and reduced API calls. When content is updated in Sanity CMS, webhooks automatically trigger cache invalidation for affected pages.

### How It Works

1. **Content Update**: You create, update, or delete content in Sanity Studio
2. **Webhook Trigger**: Sanity sends a webhook to your Next.js application
3. **Cache Invalidation**: The webhook handler identifies affected pages and revalidates specific cache tags
4. **Fresh Content**: Users immediately see updated content without waiting for a time-based revalidation interval

This approach provides:
- ✅ **Instant updates**: Content changes are reflected immediately
- ✅ **Reduced API usage**: No periodic polling or unnecessary revalidation
- ✅ **Granular control**: Only affected pages are revalidated
- ✅ **Better performance**: Cache stays fresh without rebuilding unaffected pages

### Setting Up Webhooks

To enable on-demand revalidation, configure a webhook in your Sanity project:

1. **Navigate to Webhook Settings**
   - Go to [sanity.io/manage](https://www.sanity.io/manage)
   - Select your project → **API** → **Webhooks**

2. **Create a New Webhook**
   - **Name**: `Next.js On-Demand Revalidation`
   - **URL**: `https://your-production-domain.com/api/revalidate`
   - **HTTP Method**: `POST`
   - **Trigger on**: ✅ Create, ✅ Update, ✅ Delete

3. **Configure Filter (GROQ)**
   ```groq
   _type in ['menuItem', 'menuCategory', 'siteConfig', 'legal', 'faqs']
   ```
   This ensures the webhook only fires for relevant content types.

4. **Configure Projection (GROQ)**
   ```groq
   {
     _id,
     _type,
     "slug": slug.current,
     "categorySlug": category->slug.current
   }
   ```
   This sends just enough data to determine which cache tags to invalidate.

5. **Add Secret**
   - Generate a strong secret (use a password generator)
   - Add it to the webhook configuration in Sanity
   - Add the same value as `SANITY_WEBHOOK_SECRET` in your `.env.local` and production environment variables

6. **Save and Test**
   - Save the webhook configuration
   - Test it by updating any content in Sanity Studio
   - Check your deployment logs to verify the webhook is being received

### Technical Details

The webhook endpoint (`/app/api/revalidate/route.ts`) uses Next.js's [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) function to invalidate cache entries based on document type and slug.

**Cache Tag Patterns:**

The application uses a type-safe tagging system defined in `/sanity/lib/cache-tags.ts`:

- **Collection-level tags**: `collection:{type}` - Used to invalidate all documents of a specific type
  - `collection:menuItem` - All menu items
  - `collection:menuCategory` - All menu categories
  - `collection:siteConfig` - Site configuration
  - `collection:legal` - All legal documents
  - `collection:faqs` - All FAQs

- **Document-level tags**: `{type}:{slug}` - Used to invalidate a specific document
  - `menuItem:chocolate-brownie` - Specific menu item
  - `menuCategory:brownies` - Specific category
  - `legal:privacy-policy` - Specific legal document

**Example:**

When updating a menu item with slug `chocolate-brownie` in the `brownies` category, the webhook will revalidate:
- `collection:menuItem` - All menu pages showing menu items
- `menuItem:chocolate-brownie` - The specific item detail page
- `menuCategory:brownies` - The brownies category page

This type-safe approach ensures:
- **Compile-time validation** - TypeScript enforces valid tag patterns
- **Consistency** - Helper functions (`createCollectionTag`, `createDocumentTag`) ensure uniform tag creation
- **Maintainability** - Tags are derived from Sanity schema types automatically

### Documentation References

- **Sanity Webhooks**: [sanity.io/docs/webhooks](https://www.sanity.io/docs/compute-and-ai/webhooks)
- **Next.js On-Demand Revalidation**: [nextjs.org/docs/app/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatetag](https://nextjs.org/docs/app/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatetag)
- **revalidateTag API**: [nextjs.org/docs/app/api-reference/functions/revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start both Next.js and Email preview servers concurrently |
| `pnpm dev:app` | Start Next.js development server with Turbopack |
| `pnpm dev:email` | Start Email preview server on port 3001 |
| `pnpm build` | Build the Next.js application for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint to check code quality |
| `pnpm generate:types` | Generate TypeScript types from Sanity schema |

## Project Structure

```
hzel-brown/
├── app/                    # Next.js App Router
│   ├── (static)/          # Static pages (menu, cart, contact, etc.)
│   ├── cms/               # Sanity Studio admin interface
│   └── api/               # API routes
│       └── revalidate/    # Webhook endpoint for on-demand revalidation
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── menu/             # Menu-related components
│   ├── cart/             # Shopping cart components
│   └── ui/               # Reusable UI components
├── sanity/                # Sanity CMS configuration
│   ├── schemaTypes/      # Content type definitions
│   ├── queries/          # GROQ queries
│   └── lib/              # Sanity client and utilities
├── stores/                # Zustand state management
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Deployment

This application is designed to be deployed on [Vercel](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kunalkeshan/hzel-brown)

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Configure your environment variables in the Vercel dashboard (including `SANITY_WEBHOOK_SECRET`)
4. Deploy!
5. **Important**: After deployment, configure the Sanity webhook with your production URL (see [On-Demand Revalidation](#on-demand-revalidation-with-sanity-webhooks))

For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Contact

For questions, issues, or contributions, please contact the repository owner or open an issue on GitHub.

---

Made with ❤️ for artisan dessert lovers
