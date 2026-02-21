const fs = require('fs');
const path = require('path');

describe('Sitemap Generation', () => {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  
  test('sitemap.xml file should exist', () => {
    expect(fs.existsSync(sitemapPath)).toBe(true);
  });

  test('sitemap.xml should be valid XML', () => {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Check if it's valid XML by looking for required elements
    expect(sitemapContent).toContain('<?xml');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('</urlset>');
    expect(sitemapContent).toContain('<loc>');
    expect(sitemapContent).toContain('</loc>');
  });

  test('sitemap should contain required URLs', () => {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Check for homepage URLs
    expect(sitemapContent).toMatch(/<loc>.*localhost.*<\/loc>/);
    
    // Check for recipes URLs
    expect(sitemapContent).toMatch(/recipes/);
    
    // Check for multi-language support
    expect(sitemapContent).toMatch(/en/);
    expect(sitemapContent).toMatch(/es/);
    expect(sitemapContent).toMatch(/fr/);
  });

  test('sitemap should contain proper XML structure', () => {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Check for proper XML declaration
    expect(sitemapContent).toMatch(/^<\?xml.*\?>/);
    
    // Check for xmlns attribute
    expect(sitemapContent).toMatch(/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
    
    // Check for URL elements
    expect(sitemapContent).toMatch(/<url>.*<\/url>/s);
  });

  test('sitemap should contain lastmod elements', () => {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    expect(sitemapContent).toMatch(/<lastmod>.*<\/lastmod>/);
  });

  test('sitemap file should not be empty', () => {
    const stats = fs.statSync(sitemapPath);
    expect(stats.size).toBeGreaterThan(0);
  });
});