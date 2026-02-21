const fs = require('fs');
const path = require('path');

describe('End-to-End Requirements Verification', () => {
  test('should meet all core requirements', () => {
    // Requirement 1: Docker containerization
    expect(fs.existsSync(path.join(__dirname, '../docker-compose.yml'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../Dockerfile'))).toBe(true);
    
    // Requirement 2: Environment variables
    expect(fs.existsSync(path.join(__dirname, '../.env.example'))).toBe(true);
    
    // Requirement 3: Internationalization
    const localesDir = path.join(__dirname, '../public/locales');
    expect(fs.existsSync(localesDir)).toBe(true);
    expect(fs.existsSync(path.join(localesDir, 'en', 'common.json'))).toBe(true);
    expect(fs.existsSync(path.join(localesDir, 'es', 'common.json'))).toBe(true);
    expect(fs.existsSync(path.join(localesDir, 'fr', 'common.json'))).toBe(true);
    
    // Requirement 4: Homepage SSG
    const pagesDir = path.join(__dirname, '../pages');
    expect(fs.existsSync(path.join(pagesDir, 'index.tsx'))).toBe(true);
    
    // Requirement 5: Recipe detail pages
    expect(fs.existsSync(path.join(pagesDir, 'recipes', '[slug].tsx'))).toBe(true);
    
    // Requirement 6: Language switcher
    const componentsDir = path.join(__dirname, '../src/components');
    expect(fs.existsSync(path.join(componentsDir, 'LanguageSwitcher.tsx'))).toBe(true);
    
    // Requirement 7: Content localization - verified through i18n files above
    
    // Requirement 8: Recipe search and filter
    expect(fs.existsSync(path.join(pagesDir, 'recipes', 'index.tsx'))).toBe(true);
    
    // Requirement 9: Newsletter form
    expect(fs.existsSync(path.join(componentsDir, 'NewsletterForm.tsx'))).toBe(true);
    
    // Requirement 10: Image optimization - Next.js Image component used
    const indexPage = fs.readFileSync(path.join(pagesDir, 'index.tsx'), 'utf8');
    expect(indexPage).toMatch(/import.*Image.*from.*next\/image/);
    
    // Requirement 11: Sitemap generation
    expect(fs.existsSync(path.join(__dirname, '../scripts/generate-sitemap.js'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../public/sitemap.xml'))).toBe(true);
    
    // Requirement 12: Social sharing
    const recipePage = fs.readFileSync(path.join(pagesDir, 'recipes', '[slug].tsx'), 'utf8');
    expect(recipePage).toMatch(/social-share-twitter/);
    expect(recipePage).toMatch(/twitter\.com\/intent\/tweet/);
    
    // Requirement 13: Print-friendly CSS
    const cssFile = fs.readFileSync(path.join(__dirname, '../styles/globals.css'), 'utf8');
    expect(cssFile).toMatch(/@media print/);
  });

  test('should have data-testid attributes for testing', () => {
    // Check homepage
    const indexPage = fs.readFileSync(path.join(__dirname, '../pages/index.tsx'), 'utf8');
    expect(indexPage).toMatch(/data-testid="featured-recipes"/);
    expect(indexPage).toMatch(/data-testid="recipe-card"/);
    
    // Check recipes page
    const recipesPage = fs.readFileSync(path.join(__dirname, '../pages/recipes/index.tsx'), 'utf8');
    expect(recipesPage).toMatch(/data-testid="search-input"/);
    expect(recipesPage).toMatch(/data-testid="category-filter"/);
    
    // Check recipe detail page
    const recipeDetailPage = fs.readFileSync(path.join(__dirname, '../pages/recipes/[slug].tsx'), 'utf8');
    expect(recipeDetailPage).toMatch(/data-testid="recipe-title"/);
    expect(recipeDetailPage).toMatch(/data-testid="recipe-ingredients"/);
    expect(recipeDetailPage).toMatch(/data-testid="recipe-instructions"/);
    expect(recipeDetailPage).toMatch(/data-testid="social-share-twitter"/);
    
    // Check newsletter form
    const newsletterForm = fs.readFileSync(path.join(__dirname, '../src/components/NewsletterForm.tsx'), 'utf8');
    expect(newsletterForm).toMatch(/data-testid="newsletter-form"/);
    expect(newsletterForm).toMatch(/data-testid="newsletter-email"/);
    expect(newsletterForm).toMatch(/data-testid="newsletter-submit"/);
    expect(newsletterForm).toMatch(/data-testid="newsletter-error"/);
    expect(newsletterForm).toMatch(/data-testid="newsletter-success"/);
    
    // Check language switcher
    const languageSwitcher = fs.readFileSync(path.join(__dirname, '../src/components/LanguageSwitcher.tsx'), 'utf8');
    expect(languageSwitcher).toMatch(/data-testid="language-switcher"/);
  });

  test('should have proper health check configuration', () => {
    const dockerCompose = fs.readFileSync(path.join(__dirname, '../docker-compose.yml'), 'utf8');
    expect(dockerCompose).toMatch(/healthcheck:/);
    expect(dockerCompose).toMatch(/test:/);
    expect(dockerCompose).toMatch(/interval:/);
    expect(dockerCompose).toMatch(/timeout:/);
  });

  test('should have proper port configuration', () => {
    const dockerCompose = fs.readFileSync(path.join(__dirname, '../docker-compose.yml'), 'utf8');
    expect(dockerCompose).toMatch(/"3000:3000"/);
  });
});