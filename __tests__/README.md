# Testing Documentation

This project includes comprehensive tests to verify all core requirements are met.

## Test Structure

The tests are organized in the `__tests__` directory:

```
__tests__/
├── components/           # Component tests
├── pages/               # Page tests
├── test-utils.ts        # Test utilities and mock data
├── test-utils.test.js   # Tests for test utilities
├── config.test.js       # Configuration validation tests
├── docker.test.js       # Docker configuration tests
├── sitemap.test.js      # Sitemap generation tests
└── e2e.test.js          # End-to-end requirement verification
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests with coverage:
```bash
npm run test:coverage
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run specific test file:
```bash
npx jest __tests__/config.test.js
```

## Test Coverage

The tests verify the following requirements:

### ✅ Core Requirements Covered:
1. **Docker Containerization** - Validates docker-compose.yml and Dockerfile structure
2. **Environment Variables** - Checks .env.example file existence and content
3. **Internationalization** - Verifies i18n configuration and translation files
4. **Homepage SSG** - Confirms static generation setup
5. **Recipe Detail Pages** - Validates dynamic routes and SSG implementation
6. **Language Switcher** - Checks component existence and data-testid attributes
7. **Content Localization** - Verifies multi-language support
8. **Recipe Search/Filter** - Confirms client-side functionality
9. **Newsletter Form** - Tests validation and success/error states
10. **Image Optimization** - Verifies Next.js Image component usage
11. **Sitemap Generation** - Validates sitemap.xml creation and content
12. **Social Sharing** - Checks Twitter sharing implementation
13. **Print-Friendly CSS** - Verifies @media print styles

### ✅ Additional Tests:
- **Project Configuration** - Validates package.json, next.config.js, tsconfig.json
- **File Structure** - Ensures required directories and files exist
- **Data Attributes** - Verifies all required data-testid attributes are present
- **Health Checks** - Confirms Docker health check configuration
- **Port Configuration** - Validates port mapping (3000:3000)

## Test Utilities

The `test-utils.ts` file provides:
- Mock recipe data
- Mock translations
- Reusable test data structures

## CI/CD Integration

The tests can be integrated into CI/CD pipelines:
```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:coverage
```

## Requirements Verification

The `e2e.test.js` file specifically verifies that all 13 core requirements are met by checking:
- File existence
- Configuration correctness
- Required attributes and elements
- Proper implementation patterns

## Mocking Strategy

Tests use comprehensive mocking for:
- Next.js router and i18n
- External APIs (Sanity CMS)
- Dynamic imports
- Image components
- Portable text renderer

This ensures tests are fast, reliable, and don't depend on external services.