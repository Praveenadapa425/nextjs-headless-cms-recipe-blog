import { createClient, Entry } from 'contentful';

// Contentful client configuration
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

// Recipe content type ID
const RECIPE_CONTENT_TYPE = 'recipe';

// Types for our Contentful data
export interface Recipe {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    description: any; // Rich text field
    ingredients: any; // Rich text field
    instructions: any; // Rich text field
    featuredImage?: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
    category?: {
      fields: {
        title: string;
      };
    };
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    cookingTime: number;
    isFeatured?: boolean;
  };
}

// Get all recipes for a specific locale
export async function getAllRecipes(locale: string = 'en-US'): Promise<Recipe[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      locale: locale,
    });
    
    return response.items as unknown as Recipe[];
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    return [];
  }
}

// Get featured recipes for a specific locale
export async function getFeaturedRecipes(locale: string = 'en-US', limit: number = 3): Promise<Recipe[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      'fields.isFeatured': true,
      locale: locale,
      limit: limit,
    });
    
    return response.items as unknown as Recipe[];
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    return [];
  }
}

// Get a single recipe by slug and locale
export async function getRecipeBySlug(slug: string, locale: string = 'en-US'): Promise<Recipe | null> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      'fields.slug': slug,
      locale: locale,
    });
    
    if (response.items.length > 0) {
      return response.items[0] as unknown as Recipe;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching recipe by slug:', error);
    return null;
  }
}

// Get all unique slugs for static generation
export async function getAllSlugs(): Promise<string[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      select: ['fields.slug'] as const,
    });
    
    const slugs = response.items
      .map((item: any) => item.fields.slug)
      .filter((slug: string) => slug !== undefined);
    
    // Return unique slugs only
    return [...new Set(slugs)];
  } catch (error) {
    console.error('Error fetching all slugs:', error);
    return [];
  }
}

// Get recipes by category
export async function getRecipesByCategory(categorySlug: string, locale: string = 'en-US'): Promise<Recipe[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      'fields.category.fields.slug': categorySlug,
      locale: locale,
    });
    
    return response.items as unknown as Recipe[];
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    return [];
  }
}

// Search recipes by query
export async function searchRecipes(query: string, locale: string = 'en-US'): Promise<Recipe[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      query: query,
      locale: locale,
    });
    
    return response.items as unknown as Recipe[];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

// Get recipe paths for static generation
export async function getRecipePaths(): Promise<{ params: { slug: string }; locale?: string }[]> {
  try {
    const slugs = await getAllSlugs();
    
    // Generate paths for each supported locale
    const locales = ['en', 'es', 'fr'];
    const paths: { params: { slug: string }; locale?: string }[] = [];
    
    slugs.forEach((slug) => {
      locales.forEach((locale) => {
        paths.push({
          params: { slug },
          locale,
        });
      });
    });
    
    return paths;
  } catch (error) {
    console.error('Error generating recipe paths:', error);
    return [];
  }
}

export default client;