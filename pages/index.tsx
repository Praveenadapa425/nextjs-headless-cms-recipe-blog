import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getFeaturedRecipes } from '../lib/sanity';
import { renderPortableText } from '../lib/portableTextRenderer';
import { urlFor } from '../lib/sanity';
import NewsletterForm from '../src/components/NewsletterForm';

const LanguageSwitcher = dynamic(() => import('../src/components/LanguageSwitcher'), { 
  ssr: false 
});

interface HomeProps {
  featuredRecipes: any[];
}

export default function Home({ featuredRecipes }: HomeProps) {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Blog</h1>
          <LanguageSwitcher />
        </div>
        
        <div className="text-center mb-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('featured_recipes')}</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('search_placeholder')}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-800 placeholder-gray-500 shadow-sm"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div data-testid="featured-recipes" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('featured_recipes')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe: any) => (
              <a 
                key={recipe._id} 
                href={`/recipes/${recipe.slug?.current || recipe.slug}`}
                data-testid="recipe-card" 
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {recipe.featuredImage && (
                  <div className="h-48 relative">
                    <Image 
                      src={urlFor(recipe.featuredImage).url()}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                  <div className="text-gray-700 mb-4 line-clamp-3">
                    {renderPortableText(recipe.description)}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">⏱️ {recipe.cookingTime} min</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {t(recipe.difficulty?.toLowerCase() || 'medium')}
                    </span>
                  </div>
                  <div className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    {t('view_recipe')}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        

        
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('newsletter_title')}</h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              {t('newsletter_description')}
            </p>
            <NewsletterForm />
            <p className="text-sm text-gray-500 mt-2">
              {t("no_spam")}
            </p>
          </div>
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
