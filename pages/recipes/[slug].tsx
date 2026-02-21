import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getRecipeBySlug, getAllSlugs, client } from '../../lib/sanity';
import { renderPortableText } from '../../lib/portableTextRenderer';
import { urlFor } from '../../lib/sanity';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';

const LanguageSwitcher = dynamic(() => import('../../src/components/LanguageSwitcher'), { 
  ssr: false 
});

interface RecipeDetailProps {
  recipe: any;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  
  // Generate Twitter share URL
  const generateTwitterShareUrl = () => {
    // Use router.asPath to get the current URL
    const currentPath = router.asPath;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-recipe-blog.com';
    const currentUrl = `${baseUrl}${currentPath}`;
    
    const encodedUrl = encodeURIComponent(currentUrl);
    const recipeTitle = (recipe.title && typeof recipe.title === 'object' && locale && locale in recipe.title) 
      ? recipe.title[locale] 
      : recipe.title;
    const encodedTitle = encodeURIComponent(recipeTitle || 'Check out this recipe!');
    
    return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  };

  console.log('Component received recipe:', recipe);
  console.log('Component locale:', locale);
  console.log('Recipe title in component:', recipe.title);
  console.log('Recipe description in component:', recipe.description);
  console.log('Recipe ingredients in component:', recipe.ingredients);
  console.log('Recipe instructions in component:', recipe.instructions);
  
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
          <p className="text-gray-600">The requested recipe could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="bg-white shadow-lg rounded-lg mb-8">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Recipe Blog</h1>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main>
        {/* Recipe Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
          {recipe.featuredImage && (
            <div className="h-96 relative">
              <Image 
                src={urlFor(recipe.featuredImage).url()}
                alt={(recipe.title && typeof recipe.title === 'object' && locale && locale in recipe.title) 
                  ? recipe.title[locale] 
                  : recipe.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          )}
          
          <div className="p-8">
            <h1 data-testid="recipe-title" className="text-4xl font-bold text-gray-900 mb-4">
              {(recipe.title && typeof recipe.title === 'object' && locale && locale in recipe.title) 
                ? recipe.title[locale] 
                : recipe.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                ⏱️ {recipe.cookingTime} minutes
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {t(recipe.difficulty?.toLowerCase() || 'medium')}
              </span>
              {recipe.category && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {recipe.category.title}
                </span>
              )}
              {/* Social Sharing */}
              <a 
                data-testid="social-share-twitter"
                href={generateTwitterShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                {t('share')}
              </a>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              {renderPortableText(
                (recipe.description && typeof recipe.description === 'object' && locale && locale in recipe.description) 
                  ? recipe.description[locale] 
                  : recipe.description
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('ingredients')}</h2>
            <ul data-testid="recipe-ingredients" className="space-y-3 text-gray-700">
              {renderPortableText(
                (recipe.ingredients && typeof recipe.ingredients === 'object' && locale && locale in recipe.ingredients) 
                  ? recipe.ingredients[locale] 
                  : recipe.ingredients
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('instructions')}</h2>
            <div data-testid="recipe-instructions" className="space-y-4 text-gray-700">
              {renderPortableText(
                (recipe.instructions && typeof recipe.instructions === 'object' && locale && locale in recipe.instructions) 
                  ? recipe.instructions[locale] 
                  : recipe.instructions
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  console.log('getStaticPaths called');
  // Return empty paths with blocking fallback to generate pages on-demand
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  try {
    const { slug } = params as { slug: string };
    const currentLocale = locale || 'en';
    
    console.log('Fetching recipe with slug:', slug, 'and locale:', currentLocale);
    
    if (!slug) {
      return {
        notFound: true,
      };
    }
    
    // Direct Sanity query for recipe
    const recipe = await client.fetch(
      `*[_type == "recipe" && slug.current == $slug][0]{
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
      { slug }
    );
    
    console.log('Raw recipe from Sanity:', recipe);
    console.log('Current locale:', currentLocale);
    console.log('Recipe title structure:', recipe.title);
    console.log('Recipe description structure:', recipe.description);
    console.log('Recipe ingredients structure:', recipe.ingredients);
    console.log('Recipe instructions structure:', recipe.instructions);
    
    if (!recipe) {
      return {
        notFound: true,
      };
    }
    
    // Handle localization
    const localizedRecipe = {
      ...recipe,
      title: (recipe.title && typeof recipe.title === 'object' && currentLocale in recipe.title) 
        ? recipe.title[currentLocale] 
        : (recipe.title?.en || recipe.title),
      description: (recipe.description && typeof recipe.description === 'object' && currentLocale in recipe.description) 
        ? recipe.description[currentLocale] 
        : (recipe.description?.en || recipe.description),
      ingredients: (recipe.ingredients && typeof recipe.ingredients === 'object' && currentLocale in recipe.ingredients) 
        ? recipe.ingredients[currentLocale] 
        : (recipe.ingredients?.en || recipe.ingredients),
      instructions: (recipe.instructions && typeof recipe.instructions === 'object' && currentLocale in recipe.instructions) 
        ? recipe.instructions[currentLocale] 
        : (recipe.instructions?.en || recipe.instructions),
    };
    
    console.log('Localized recipe:', localizedRecipe);
    console.log('Localized title:', localizedRecipe.title);
    console.log('Localized description type:', typeof localizedRecipe.description);
    console.log('Localized ingredients type:', typeof localizedRecipe.ingredients);
    console.log('Localized instructions type:', typeof localizedRecipe.instructions);
    
    return {
      props: {
        recipe: localizedRecipe,
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
      revalidate: 60, // Revalidate at most once every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return {
      notFound: true,
    };
  }
};