import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { pathname, asPath, query } = router;
  const [isClient, setIsClient] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(router.locale || 'en');

  useEffect(() => {
    setIsClient(true);
    setCurrentLocale(router.locale || 'en');
  }, [router.locale]);

  const changeLanguage = (locale: string) => {
    // Preserve the current route when changing language
    router.push(asPath, asPath, { locale });
  };

  // Default to English during SSR
  const localeToDisplay = isClient ? currentLocale : 'en';

  return (
    <div data-testid="language-switcher" className="relative">
      <select 
        value={localeToDisplay}
        onChange={(e) => {
          setCurrentLocale(e.target.value);
          changeLanguage(e.target.value);
        }}
        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;