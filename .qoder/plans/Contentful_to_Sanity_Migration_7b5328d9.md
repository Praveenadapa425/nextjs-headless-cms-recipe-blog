# Contentful to Sanity Migration Plan

## Phase 1: Environment Setup and Dependencies

### 1.1 Update Environment Variables
Update `.env.local` file:
```bash
# Remove Contentful variables
# CONTENTFUL_SPACE_ID=your_space_id
# CONTENTFUL_ACCESS_TOKEN=your_access_token

# Add Sanity configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

### 1.2 Install/Update Dependencies
```bash
# Remove Contentful dependencies
npm uninstall contentful @contentful/rich-text-react-renderer @contentful/rich-text-types axios

# Install Sanity dependencies
npm install @sanity/client @sanity/image-url
npm install @portabletext/react  # For rich text rendering in Sanity
```

## Phase 2: Create New Sanity Client

### 2.1 Create Sanity Client File
Create `/lib/sanity.ts`:
```typescript
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ queries for recipes
export const recipeQueries = {
  getAllRecipes: `*[_type == "recipe"]{
    _id,
    title,
    slug,
    description,
    ingredients,
    instructions,
    featuredImage,
    category,
    difficulty,
    cookingTime,
    isFeatured
  }`,
  
  getFeaturedRecipes: `*[_type == "recipe" && isFeatured == true][0...3]{
    _id,
    title,
    slug,
    description,
    featuredImage,
    category,
    difficulty,
    cookingTime
  }`,
  
  getRecipeBySlug: (slug: string) => `*[_type == "recipe" && slug.current == "${slug}"][0]{
    _id,
    title,
    slug,
    description,
    ingredients,
    instructions,
    featuredImage,
    category,
    difficulty,
    cookingTime,
    isFeatured
  }`,
  
  getAllSlugs: `*[_type == "recipe"]{
    "slug": slug.current
  }`
}
```

### 2.2 Create Portable Text Renderer
Create `/lib/portableTextRenderer.tsx`:
```typescript
import { PortableText } from '@portabletext/react'

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <u>{children}</u>,
    link: ({ value, children }: any) => (
      <a 
        href={value?.href} 
        className="text-blue-600 hover:underline" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
}

export function renderPortableText(content: any) {
  if (!content) return null
  return <PortableText value={content} components={portableTextComponents} />
}
```

## Phase 3: Update Data Fetching Functions

### 3.1 Replace Contentful Service Functions
Update `/lib/sanity.ts` with migration functions:
```typescript
// Get all recipes for a specific locale
export async function getAllRecipes(locale: string = 'en'): Promise<any[]> {
  try {
    const recipes = await client.fetch(recipeQueries.getAllRecipes)
    
    // Handle localization - assuming Sanity structure with localized fields
    return recipes.map((recipe: any) => ({
      ...recipe,
      title: recipe.title?.[locale] || recipe.title,
      description: recipe.description?.[locale] || recipe.description,
      ingredients: recipe.ingredients?.[locale] || recipe.ingredients,
      instructions: recipe.instructions?.[locale] || recipe.instructions,
    }))
  } catch (error) {
    console.error('Error fetching all recipes:', error)
    return []
  }
}

// Get featured recipes for a specific locale
export async function getFeaturedRecipes(locale: string = 'en', limit: number = 3): Promise<any[]> {
  try {
    const recipes = await client.fetch(recipeQueries.getFeaturedRecipes)
    
    return recipes.map((recipe: any) => ({
      ...recipe,
      title: recipe.title?.[locale] || recipe.title,
      description: recipe.description?.[locale] || recipe.description,
    })).slice(0, limit)
  } catch (error) {
    console.error('Error fetching featured recipes:', error)
    return []
  }
}

// Get a single recipe by slug and locale
export async function getRecipeBySlug(slug: string, locale: string = 'en'): Promise<any | null> {
  try {
    const recipe = await client.fetch(recipeQueries.getRecipeBySlug(slug))
    
    if (recipe) {
      return {
        ...recipe,
        title: recipe.title?.[locale] || recipe.title,
        description: recipe.description?.[locale] || recipe.description,
        ingredients: recipe.ingredients?.[locale] || recipe.ingredients,
        instructions: recipe.instructions?.[locale] || recipe.instructions,
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching recipe by slug:', error)
    return null
  }
}

// Get all unique slugs for static generation
export async function getAllSlugs(): Promise<string[]> {
  try {
    const slugs = await client.fetch(recipeQueries.getAllSlugs)
    return slugs.map((item: any) => item.slug).filter((slug: string) => slug !== undefined)
  } catch (error) {
    console.error('Error fetching all slugs:', error)
    return []
  }
}
```

## Phase 4: Update Page Components

### 4.1 Update Homepage (`/pages/index.tsx`)
```typescript
// Update imports
import { getFeaturedRecipes } from '../lib/sanity'
import { renderPortableText } from '../lib/portableTextRenderer'

// Update image rendering
{recipe.featuredImage && (
  <div className="h-48 relative">
    <Image 
      src={urlFor(recipe.featuredImage).width(800).url()}
      alt={recipe.title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
)}

// Update rich text rendering
<div className="text-gray-600 mb-4 line-clamp-3">
  {renderPortableText(recipe.description)}
</div>
```

### 4.2 Update Recipes Index Page (`/pages/recipes/index.tsx`)
```typescript
// Update imports
import { getAllRecipes } from '../../lib/sanity'
import { renderPortableText } from '../../lib/portableTextRenderer'
import { urlFor } from '../../lib/sanity'

// Update image rendering
{recipe.featuredImage && (
  <div className="h-48 relative">
    <Image 
      src={urlFor(recipe.featuredImage).width(800).url()}
      alt={recipe.title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
)}

// Update rich text rendering
<div className="text-gray-600 mb-4 line-clamp-3">
  {renderPortableText(recipe.description)}
</div>
```

### 4.3 Update Recipe Detail Page (`/pages/recipes/[slug].tsx`)
```typescript
// Update imports
import { getRecipeBySlug, getAllSlugs } from '../../lib/sanity'
import { renderPortableText } from '../../lib/portableTextRenderer'
import { urlFor } from '../../lib/sanity'

// Update image rendering
{recipe.featuredImage && (
  <div className="h-96 relative">
    <Image 
      src={urlFor(recipe.featuredImage).width(1200).url()}
      alt={recipe.title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
      priority
    />
  </div>
)}

// Update rich text rendering
<div className="prose max-w-none text-gray-700">
  {renderPortableText(recipe.description)}
</div>

// Update ingredients and instructions
<ul data-testid="recipe-ingredients" className="space-y-3">
  {renderPortableText(recipe.ingredients)}
</ul>

<div data-testid="recipe-instructions" className="space-y-4">
  {renderPortableText(recipe.instructions)}
</div>
```

## Phase 5: Update Sitemap Generation

### 5.1 Update Sitemap Script (`/scripts/generate-sitemap.js`)
```javascript
// Replace Contentful API calls with Sanity queries
const { client } = require('../lib/sanity')

async function fetchAllSlugs() {
  try {
    const slugs = await client.fetch('*[_type == "recipe"]{ "slug": slug.current }')
    return slugs.map(item => item.slug).filter(slug => slug !== undefined)
  } catch (error) {
    console.error('Error fetching slugs from Sanity:', error)
    return []
  }
}
```

## Phase 6: Testing and Validation

### 6.1 Test All Pages
- Homepage with featured recipes
- Recipes listing page with filtering
- Individual recipe detail pages
- All language translations
- Image rendering
- Rich text content rendering

### 6.2 Verify Static Generation
- Test `getStaticProps` and `getStaticPaths` functions
- Verify ISR revalidation works correctly
- Check sitemap generation

### 6.3 Performance Testing
- Compare build times
- Check page load performance
- Verify image optimization

## Phase 7: Cleanup

### 7.1 Remove Unused Files
- Delete `/lib/contentful.ts`
- Remove unused Contentful dependencies
- Clean up any Contentful-specific code

### 7.2 Update Documentation
- Update README with new Sanity setup instructions
- Document any changes in the migration process
- Update environment variable documentation

## Important Considerations

1. **Data Structure**: Ensure your Sanity schema matches the expected data structure
2. **Localization**: Verify how localization is handled in your Sanity setup
3. **Image Handling**: Test all image rendering scenarios
4. **Rich Text**: Ensure Portable Text rendering matches your current Contentful rich text output
5. **SEO**: Verify all meta tags and structured data still work correctly
6. **Caching**: Update any caching strategies to work with Sanity's CDN

## Timeline Estimate
- Phase 1-2: 2-3 hours
- Phase 3-4: 4-6 hours  
- Phase 5-6: 2-3 hours
- Phase 7: 1-2 hours
- **Total: 9-14 hours**

## Backup Plan
Keep your current Contentful implementation in a separate branch until the Sanity migration is fully tested and validated.