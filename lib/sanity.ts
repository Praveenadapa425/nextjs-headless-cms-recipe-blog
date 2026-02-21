import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

// Validate project ID format
if (projectId && !/^[a-z0-9-]+$/.test(projectId)) {
  console.warn('Invalid Sanity project ID format. Please check your .env.local file.');
}

export const client = createClient({
  projectId: projectId || 'dummy-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  // token is not required for read-only access to public datasets
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

// Get all recipes for a specific locale
export async function getAllRecipes(locale: string = 'en'): Promise<any[]> {
  try {
    // Check if we have a valid project ID
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_sanity_project_id') {
      console.warn('Sanity project ID not configured. Please set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
      return [];
    }
    
    // Check if dataset is configured
    if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
      console.warn('Sanity dataset not configured. Please set NEXT_PUBLIC_SANITY_DATASET in .env.local');
      return [];
    }
    
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
    // Check if we have a valid project ID
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_sanity_project_id') {
      console.warn('Sanity project ID not configured. Please set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
      return [];
    }
    
    // Check if dataset is configured
    if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
      console.warn('Sanity dataset not configured. Please set NEXT_PUBLIC_SANITY_DATASET in .env.local');
      return [];
    }
    
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
    // Check if we have a valid project ID
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_sanity_project_id') {
      console.warn('Sanity project ID not configured. Please set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
      return null;
    }
    
    // Check if dataset is configured
    if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
      console.warn('Sanity dataset not configured. Please set NEXT_PUBLIC_SANITY_DATASET in .env.local');
      return null;
    }
    
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
    // Check if we have a valid project ID
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your_sanity_project_id') {
      console.warn('Sanity project ID not configured. Please set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
      return [];
    }
    
    // Check if dataset is configured
    if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
      console.warn('Sanity dataset not configured. Please set NEXT_PUBLIC_SANITY_DATASET in .env.local');
      return [];
    }
    
    const slugs = await client.fetch(recipeQueries.getAllSlugs)
    return slugs.map((item: any) => item.slug).filter((slug: string) => slug !== undefined)
  } catch (error) {
    console.error('Error fetching all slugs:', error)
    return []
  }
}