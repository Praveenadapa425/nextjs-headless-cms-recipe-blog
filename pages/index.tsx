import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getFeaturedRecipes } from '../lib/sanity';
import { renderPortableText } from '../lib/portableTextRenderer';
import { urlFor } from '../lib/sanity';

const LanguageSwitcher = dynamic(() => import('../src/components/LanguageSwitcher'), { 
  ssr: false 
});

interface HomeProps {
  featuredRecipes: any[];
}

export default function Home({ featuredRecipes }: HomeProps) {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Recipe Blog</h1>
          <LanguageSwitcher />
        </div>
        
        <div className="text-center mb-8">
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div data-testid="featured-recipes" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Featured Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe: any) => (
              <div key={recipe._id} data-testid="recipe-card" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h3>
                  <div className="text-gray-600 mb-4 line-clamp-3">
                    {renderPortableText(recipe.description)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">⏱️ {recipe.cookingTime} min</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('ingredients')}</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Fresh vegetables</li>
              <li>• Quality proteins</li>
              <li>• Herbs and spices</li>
              <li>• Essential pantry items</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('instructions')}</h2>
            <ol className="space-y-2 text-gray-600 list-decimal list-inside">
              <li>Prepare all ingredients</li>
              <li>Follow step-by-step guide</li>
              <li>Cook with love</li>
              <li>Enjoy your creation</li>
            </ol>
          </div>
        </div>
        
        <div className="mt-8 text-center p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">{t('newsletter_title')}</h3>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  console.log('Fetching featured recipes for locale:', locale);
  const featuredRecipes = await getFeaturedRecipes(locale, 3);
  console.log('Fetched recipes:', featuredRecipes);
  
  return {
    props: {
      featuredRecipes,
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 60, // Revalidate at most once every 60 seconds
  };
}
