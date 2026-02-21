// Simple test utilities
export const mockRecipe = {
  _id: 'test-recipe-1',
  title: 'Test Recipe',
  slug: { current: 'test-recipe' },
  description: 'Test description',
  featuredImage: { asset: { _ref: 'image-1' } },
  cookingTime: 30,
  difficulty: 'Easy',
  category: { title: 'Dessert' },
  ingredients: 'Test ingredients',
  instructions: 'Test instructions',
};

export const mockRecipes = [
  mockRecipe,
  {
    _id: 'test-recipe-2',
    title: 'Test Recipe 2',
    slug: { current: 'test-recipe-2' },
    description: 'Test description 2',
    featuredImage: { asset: { _ref: 'image-2' } },
    cookingTime: 45,
    difficulty: 'Medium',
    category: { title: 'Main Course' },
    ingredients: 'Test ingredients 2',
    instructions: 'Test instructions 2',
  },
];

export const mockTranslations = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'featured_recipes': 'Featured Recipes',
      'search_placeholder': 'Search recipes...',
      'view_recipe': 'View Recipe',
      'easy': 'Easy',
      'medium': 'Medium',
      'hard': 'Hard',
      'newsletter_title': 'Stay Updated with New Recipes',
      'newsletter_description': 'Join our newsletter...',
      'no_spam': 'No spam, unsubscribe anytime',
      'ingredients': 'Ingredients',
      'instructions': 'Instructions',
      'share': 'Share',
      'subscribe': 'Subscribe',
      'email_placeholder': 'Enter your email address',
      'subscribing': 'Subscribing...',
      'thank_you_for_subscribing': 'Thank you for subscribing!',
      'receive_updates': 'You\'ll receive our latest recipes and updates.',
    };
    return translations[key] || key;
  },
};