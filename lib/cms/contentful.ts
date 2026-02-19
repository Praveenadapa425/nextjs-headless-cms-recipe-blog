import { createClient } from 'contentful';

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

// Fetch all recipes
export async function getRecipes(locale: string = 'en-US'): Promise<Recipe[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      locale: locale,
    });
    
    return response.items as Recipe[];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Fetch a single recipe by slug
export async function getRecipeBySlug(slug: string, locale: string = 'en-US'): Promise<Recipe | null> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      'fields.slug': slug,
      locale: locale,
    });
    
    if (response.items.length > 0) {
      return response.items[0] as Recipe;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

// Fetch featured recipes
export async function getFeaturedRecipes(locale: string = 'en-US', limit: number = 3): Promise<Recipe[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      'fields.isFeatured': true,
      locale: locale,
      limit: limit,
    });
    
    return response.items as Recipe[];
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    return [];
  }
}

// Fetch recipes by category
export async function getRecipesByCategory(categorySlug: string, locale: string = 'en-US'): Promise<Recipe[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      'fields.category.fields.slug': categorySlug,
      locale: locale,
    });
    
    return response.items as Recipe[];
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    return [];
  }
}

// Search recipes
export async function searchRecipes(query: string, locale: string = 'en-US'): Promise<Recipe[]> {
  try {
    const response = await client.getEntries({
      content_type: RECIPE_CONTENT_TYPE,
      query: query,
      locale: locale,
    });
    
    return response.items as Recipe[];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

export default client;