import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';

const LanguageSwitcher = dynamic(() => import('../src/components/LanguageSwitcher'), { 
  ssr: false 
});

export default function Home() {
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

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
