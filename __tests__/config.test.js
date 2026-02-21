const fs = require('fs');
const path = require('path');

describe('Project Configuration', () => {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const nextConfigPath = path.join(__dirname, '../next.config.js');
  const tsConfigPath = path.join(__dirname, '../tsconfig.json');
  
  test('package.json should exist and be valid', () => {
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check required fields
    expect(packageJson).toHaveProperty('name');
    expect(packageJson).toHaveProperty('version');
    expect(packageJson).toHaveProperty('scripts');
    expect(packageJson).toHaveProperty('dependencies');
    expect(packageJson).toHaveProperty('devDependencies');
    
    // Check required scripts
    expect(packageJson.scripts).toHaveProperty('dev');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('start');
    expect(packageJson.scripts).toHaveProperty('test');
  });

  test('next.config.js should exist and configure i18n', () => {
    expect(fs.existsSync(nextConfigPath)).toBe(true);
    
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Check for i18n configuration
    expect(nextConfigContent).toMatch(/i18n/);
    
    // Check for images configuration
    expect(nextConfigContent).toMatch(/images/);
    expect(nextConfigContent).toMatch(/remotePatterns/);
  });

  test('tsconfig.json should exist and be properly configured', () => {
    expect(fs.existsSync(tsConfigPath)).toBe(true);
    
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    
    // Check required compiler options
    expect(tsConfig).toHaveProperty('compilerOptions');
    expect(tsConfig.compilerOptions).toHaveProperty('target');
    expect(tsConfig.compilerOptions).toHaveProperty('lib');
    expect(tsConfig.compilerOptions).toHaveProperty('jsx');
    
    // Check for Next.js specific settings
    expect(tsConfig.compilerOptions.target).toBe('es5');
    expect(tsConfig.compilerOptions.lib).toContain('dom');
    expect(tsConfig.compilerOptions.lib).toContain('dom.iterable');
    expect(tsConfig.compilerOptions.lib).toContain('esnext');
  });

  test('should have required dependencies', () => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for Next.js
    expect(packageJson.dependencies).toHaveProperty('next');
    expect(packageJson.dependencies).toHaveProperty('react');
    expect(packageJson.dependencies).toHaveProperty('react-dom');
    
    // Check for i18n dependencies
    expect(packageJson.dependencies).toHaveProperty('next-i18next');
    expect(packageJson.dependencies).toHaveProperty('i18next');
    expect(packageJson.dependencies).toHaveProperty('react-i18next');
    
    // Check for CMS dependencies
    expect(packageJson.dependencies).toHaveProperty('@sanity/client');
    expect(packageJson.dependencies).toHaveProperty('@sanity/image-url');
    
    // Check for styling
    expect(packageJson.dependencies).toHaveProperty('tailwindcss');
  });

  test('should have required devDependencies for testing', () => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    expect(packageJson.devDependencies).toHaveProperty('jest');
    expect(packageJson.devDependencies).toHaveProperty('@testing-library/react');
    expect(packageJson.devDependencies).toHaveProperty('@testing-library/jest-dom');
    expect(packageJson.devDependencies).toHaveProperty('ts-jest');
    expect(packageJson.devDependencies).toHaveProperty('@types/jest');
  });

  test('project should have proper directory structure', () => {
    const requiredDirs = ['pages', 'public', 'src', 'components', 'lib', 'styles'];
    const requiredFiles = ['README.md', 'Dockerfile', 'docker-compose.yml', '.env.example'];
    
    requiredDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '../', dir);
      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });
    
    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, '../', file);
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.statSync(filePath).isFile()).toBe(true);
    });
  });

  test('should have internationalization files', () => {
    const localesDir = path.join(__dirname, '../public/locales');
    expect(fs.existsSync(localesDir)).toBe(true);
    
    const locales = ['en', 'es', 'fr'];
    locales.forEach(locale => {
      const localeDir = path.join(localesDir, locale);
      expect(fs.existsSync(localeDir)).toBe(true);
      
      const commonJson = path.join(localeDir, 'common.json');
      expect(fs.existsSync(commonJson)).toBe(true);
    });
  });
});