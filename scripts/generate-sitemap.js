const fs = require('fs');
const path = require('path');

// Base URL - update this to your production URL
const BASE_URL = (process.env.SITE_URL || 'http://localhost:3002').trim();

function generateSitemapUrls() {
  const locales = ['en', 'es', 'fr'];
  const urls = [];
  
  // Add static pages
  locales.forEach(locale => {
    urls.push({
      loc: `${BASE_URL}/${locale === 'en' ? '' : locale}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    });
    
    const recipePath = locale === 'en' ? 'recipes' : `${locale}/recipes`;
    urls.push({
      loc: `${BASE_URL}/${recipePath}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.8
    });
  });
  
  // Add some sample recipe pages (these would be dynamically fetched from your CMS in production)
  const sampleRecipes = ['indian-butter-chicken', 'classic-spanish-paella', 'italian-pasta-carbonara'];
  
  sampleRecipes.forEach(slug => {
    locales.forEach(locale => {
      const recipePath = locale === 'en' ? `recipes/${slug}` : `${locale}/recipes/${slug}`;
      urls.push({
        loc: `${BASE_URL}/${recipePath}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.9
      });
    });
  });
  
  return urls;
}

function generateSitemapXml(urls) {
  const xmlUrls = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

function generateSitemap() {
  try {
    console.log('🔗 Generating sitemap URLs...');
    const urls = generateSitemapUrls();
    console.log(`✅ Generated ${urls.length} URLs`);
    
    console.log('📝 Creating sitemap XML...');
    const sitemapXml = generateSitemapXml(urls);
    
    // Ensure public directory exists
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write sitemap file
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml);
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📁 Location: ${sitemapPath}`);
    console.log(`🌐 URLs included: ${urls.length}`);
    
    // Display sample URLs for verification
    console.log('\n📋 Sample URLs included:');
    console.log(`  - ${BASE_URL}/ (English homepage)`);
    console.log(`  - ${BASE_URL}/es (Spanish homepage)`);
    console.log(`  - ${BASE_URL}/fr (French homepage)`);
    console.log(`  - ${BASE_URL}/recipes (English recipes)`);
    console.log(`  - ${BASE_URL}/es/recipes (Spanish recipes)`);
    console.log(`  - ${BASE_URL}/fr/recipes (French recipes)`);
    
    console.log(`  - ${BASE_URL}/recipes/indian-butter-chicken (English recipe)`);
    console.log(`  - ${BASE_URL}/es/recipes/indian-butter-chicken (Spanish recipe)`);
    console.log(`  - ${BASE_URL}/fr/recipes/indian-butter-chicken (French recipe)`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the sitemap generation
generateSitemap();