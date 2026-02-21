import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getRecipeBySlug, getAllSlugs } from '../../lib/sanity';
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
  
  // Generate Twitter share URL
  const generateTwitterShareUrl = () => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      const encodedUrl = encodeURIComponent(currentUrl);
      const encodedTitle = encodeURIComponent(recipe.title);
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    }
    return '#';
  };

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
          
          <div className="p-8">
            <h1 data-testid="recipe-title" className="text-4xl font-bold text-gray-800 mb-4">
              {recipe.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                ⏱️ {recipe.cookingTime} minutes
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {recipe.difficulty}
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
                className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Share
              </a>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              {renderPortableText(recipe.description)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredients</h2>
            <ul data-testid="recipe-ingredients" className="space-y-3">
              {renderPortableText(recipe.ingredients)}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions</h2>
            <div data-testid="recipe-instructions" className="space-y-4">
              {renderPortableText(recipe.instructions)}
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