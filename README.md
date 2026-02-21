# Recipe Blog - Next.js with Sanity CMS

This is a [Next.js](https://nextjs.org) recipe blog project that uses Sanity CMS for content management with internationalization support.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Sanity account and project

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Sanity configuration:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_sanity_api_token
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Sanity CMS Setup

1. Create a Sanity project at [sanity.io](https://www.sanity.io/)
2. Define your recipe schema in Sanity Studio
3. Add content to your Sanity dataset
4. Update the environment variables with your project details

## Features

- 🍳 Recipe management with Sanity CMS
- 🌍 Internationalization (English, Spanish, French)
- 📱 Responsive design
- 🔍 Search and filtering
- 🖼️ Image optimization
- 📈 SEO optimized with sitemap generation
- ⚡ Fast static site generation

## Project Structure

```
├── components/          # React components
├── lib/                 # Utility functions and Sanity client
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   ├── recipes/        # Recipe pages
│   └── index.tsx       # Homepage
├── public/             # Static assets
├── scripts/            # Utility scripts
└── styles/             # CSS styles
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity CMS Documentation](https://www.sanity.io/docs)
- [Next.js Internationalization](https://nextjs.org/docs/pages/building-your-application/routing/internationalization)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
