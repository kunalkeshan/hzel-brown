# Hzel Brown

An artisan dessert shop e-commerce platform specializing in handcrafted brownies, brookies, cupcakes, and cookies with delivery across Tamil Nadu, India.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
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
3. Configure your environment variables in the Vercel dashboard
4. Deploy!

For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Contact

For questions, issues, or contributions, please contact the repository owner or open an issue on GitHub.

---

Made with ❤️ for artisan dessert lovers
