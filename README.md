# 🌍 Internationalized Recipe Blog  
**Next.js + Sanity CMS + Docker**

A modern, multilingual recipe blog built with **Next.js**, powered by **Sanity (Headless CMS)**, styled with **Tailwind CSS**, and fully containerized using **Docker**.

This project demonstrates Static Site Generation (SSG), internationalization (i18n), SEO best practices, client-side filtering, and production-ready deployment.

---

## 🚀 Features

- 🌎 Internationalization (English 🇺🇸, Spanish 🇪🇸, French 🇫🇷)
- ⚡ Static Site Generation (SSG) with Incremental Static Regeneration (ISR)
- 📦 Headless CMS integration (Sanity)
- 🔍 Client-side search and category filtering
- 🖼 Optimized images using `next/image`
- 📑 Dynamic recipe pages with localized content
- 📡 Twitter social sharing integration
- 📰 Newsletter form with validation (frontend only)
- 🗺 Automatically generated sitemap
- 🖨 Print-friendly recipe layout
- 🐳 Fully containerized with Docker & Docker Compose

---

## 🏗 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js (Pages Router) |
| CMS | Sanity |
| Styling | Tailwind CSS |
| Internationalization | next-i18next |
| SEO | next-seo |
| Containerization | Docker & Docker Compose |

---

## 📦 Installation (Local Development)

### Prerequisites

- Node.js 18+
- npm
- Sanity project

---

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd recipe-blog
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SITE_URL=http://localhost:3000
```

---

### 4️⃣ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🐳 Run with Docker (Recommended)

### Build & Start

```bash
docker-compose up --build -d
```

Access the app at:

```
http://localhost:3000
```

The container includes:

- Production build
- Healthcheck
- Restart policy
- Multi-stage optimized Docker image

---

## 🌐 Internationalization

Supported locales:

- `en` (Default)
- `es`
- `fr`

Features:

- Localized UI using `next-i18next`
- Localized CMS content via Sanity
- Language switcher preserves route
- `<html lang>` attribute dynamically updated

---

## 📊 Data Fetching Strategy

| Page | Rendering Method |
|------|------------------|
| Homepage | SSG (`getStaticProps`) |
| Recipe Detail | SSG (`getStaticPaths` + `getStaticProps`) |
| Recipes List | SSG + Client-side filtering |

ISR is enabled for automatic content updates without full rebuilds.

---

## 🔍 Search & Filtering

The `/recipes` page includes:

- Search input
- Category dropdown filter
- Client-side filtering (no additional API calls)

---

## 📈 SEO Strategy

- Static pre-rendered HTML (SSG)
- Dynamic metadata per recipe
- Open Graph & Twitter meta tags
- Language-specific URLs
- Sitemap generation for all locales
- Clean slug-based routing

Sitemap available at:

```
/sitemap.xml
```

---

## 🖨 Print-Friendly Version

Recipe pages include print styles:

- Header hidden
- Footer hidden
- Comments hidden
- Clean printable layout

Implemented using `@media print`.

---

## 📁 Project Structure

```
/components        # Reusable UI components
/pages             # Next.js pages
/public/locales    # Translation files
/lib               # Sanity client
/scripts           # Sitemap generator
/styles            # Global styles
Dockerfile
docker-compose.yml
.env.example
```

---

## 🧪 Verification Checklist

✔ SSG confirmed (`x-nextjs-cache: HIT`)  
✔ All UI fully translated  
✔ Images optimized  
✔ Sitemap includes all locales  
✔ Docker healthcheck working  
✔ Social share generates correct URL  
✔ Newsletter validation functional  
✔ Print layout hides non-essential UI  

---

## 🎯 Submission Compliance

This project satisfies all assignment requirements:

- ✅ Dockerized application
- ✅ Headless CMS integration
- ✅ 3-language internationalization
- ✅ Static Site Generation
- ✅ SEO optimization
- ✅ Sitemap generation
- ✅ Social sharing
- ✅ Newsletter functionality
- ✅ Image optimization
- ✅ Print styles

---

## 👨‍💻 Author

Praveen Adapa  

---
