import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useMemo } from 'react';
import { getAllRecipes } from '../../lib/sanity';
import { renderPortableText } from '../../lib/portableTextRenderer';
import { urlFor } from '../../lib/sanity';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const LanguageSwitcher = dynamic(() => import('../../src/components/LanguageSwitcher'), { 
  ssr: false 
});

interface Recipe {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: any;
  featuredImage?: any;
  category?: {
    title: string;
  };
  difficulty: string;
  cookingTime: number;
}

interface RecipesPageProps {
  recipes: Recipe[];
  categories: string[];
}

export default function RecipesPage({ recipes, categories }: RecipesPageProps) {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Client-side filtering
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = searchTerm === '' || recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || 
        (recipe.category && recipe.category.title === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="bg-white shadow-lg rounded-lg mb-8">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-800 mb-2">
                Search Recipes
              </label>
              <input
                data-testid="search-input"
                type="text"
                id="search"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-800 mb-2">
                Filter by Category
              </label>
              <select
                data-testid="category-filter"
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </p>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <a 
                key={recipe._id} 
                href={`/recipes/${recipe.slug?.current || recipe.slug}`}
                className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
              >
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
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {recipe.title}
                  </h2>
                  
                  <div className="text-gray-700 mb-4 line-clamp-3">
                    {renderPortableText(recipe.description)}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      ⏱️ {recipe.cookingTime} min
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {t(recipe.difficulty?.toLowerCase() || 'medium')}
                    </span>
                    {recipe.category && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {recipe.category.title}
                      </span>
                    )}
                  </div>
                  
                  <a 
                    href={`/recipes/${recipe.slug?.current || recipe.slug}`}
                    className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('view_recipe')}
                  </a>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-700">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const recipes = await getAllRecipes(locale);
    
    // Extract unique categories
    const categories = Array.from(
      new Set(
        recipes
          .map(recipe => recipe.category?.title)
          .filter((category): category is string => category !== undefined)
      )
    ).sort();
    
    return {
      props: {
        recipes: recipes,
        categories,
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return {
      props: {
        recipes: [],
        categories: [],
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
      revalidate: 60,
    };
  }
};