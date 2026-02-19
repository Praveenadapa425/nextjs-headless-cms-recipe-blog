import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { pathname, asPath, query } = router;

  const changeLanguage = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div data-testid="language-switcher">
      <select 
        value={i18n.language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;