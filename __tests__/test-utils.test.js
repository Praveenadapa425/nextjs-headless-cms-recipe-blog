// Simple test for utility functions
const { mockRecipe, mockRecipes, mockTranslations } = require('./test-utils');

describe('Test Utilities', () => {
  test('mockRecipe should have correct structure', () => {
    expect(mockRecipe).toHaveProperty('_id');
    expect(mockRecipe).toHaveProperty('title');
    expect(mockRecipe).toHaveProperty('slug');
    expect(mockRecipe).toHaveProperty('description');
    expect(mockRecipe).toHaveProperty('cookingTime');
    expect(mockRecipe).toHaveProperty('difficulty');
    
    expect(mockRecipe.title).toBe('Test Recipe');
    expect(mockRecipe.cookingTime).toBe(30);
    expect(mockRecipe.difficulty).toBe('Easy');
  });

  test('mockRecipes array should contain 2 recipes', () => {
    expect(mockRecipes).toHaveLength(2);
    expect(mockRecipes[0].title).toBe('Test Recipe');
    expect(mockRecipes[1].title).toBe('Test Recipe 2');
  });

  test('mockTranslations should translate keys correctly', () => {
    const t = mockTranslations.t;
    
    expect(t('featured_recipes')).toBe('Featured Recipes');
    expect(t('search_placeholder')).toBe('Search recipes...');
    expect(t('view_recipe')).toBe('View Recipe');
    expect(t('easy')).toBe('Easy');
    expect(t('medium')).toBe('Medium');
    expect(t('hard')).toBe('Hard');
    expect(t('newsletter_title')).toBe('Stay Updated with New Recipes');
    
    // Test fallback for unknown keys
    expect(t('unknown_key')).toBe('unknown_key');
  });

  test('mockRecipes should have unique IDs', () => {
    const ids = mockRecipes.map(recipe => recipe._id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toHaveLength(uniqueIds.length);
  });

  test('all mock recipes should have required fields', () => {
    mockRecipes.forEach(recipe => {
      expect(recipe).toHaveProperty('_id');
      expect(recipe).toHaveProperty('title');
      expect(recipe).toHaveProperty('slug');
      expect(recipe).toHaveProperty('description');
      expect(recipe).toHaveProperty('cookingTime');
      expect(recipe).toHaveProperty('difficulty');
    });
  });
});