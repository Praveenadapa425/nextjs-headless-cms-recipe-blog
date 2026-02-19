import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getRecipeBySlug, getAllSlugs, Recipe } from '../../src/lib/contentful';
import { renderRichText } from '../../src/lib/richTextRenderer';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const LanguageSwitcher = dynamic(() => import('../../src/components/LanguageSwitcher'), { 
  ssr: false 
});

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const { t } = useTranslation('common');

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Recipe Blog</h1>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {recipe.fields.featuredImage && (
            <div className="h-96 relative">
              <Image 
                src={`https:${recipe.fields.featuredImage.fields.file.url}`}
                alt={recipe.fields.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          )}
          
          <div className="p-8">
            <h1 data-testid="recipe-title" className="text-4xl font-bold text-gray-800 mb-4">
              {recipe.fields.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                ⏱️ {recipe.fields.cookingTime} minutes
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {recipe.fields.difficulty}
              </span>
              {recipe.fields.category && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {recipe.fields.category.fields.title}
                </span>
              )}
            </div>
            
            <div className="prose max-w-none text-gray-700">
              {renderRichText(recipe.fields.description)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredients</h2>
            <ul data-testid="recipe-ingredients" className="space-y-3">
              {renderRichText(recipe.fields.ingredients)}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions</h2>
            <div data-testid="recipe-instructions" className="space-y-4">
              {renderRichText(recipe.fields.instructions)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
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
    
    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  try {
    const { slug } = params as { slug: string };
    
    if (!slug) {
      return {
        notFound: true,
      };
    }
    
    const recipe = await getRecipeBySlug(slug, locale);
    
    if (!recipe) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: {
        recipe,
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