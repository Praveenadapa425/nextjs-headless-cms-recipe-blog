import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
  }),
}));

// Mock next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'en',
    },
  }),
}));

// Mock next/dynamic
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFunc, options) => {
    const component = () => importFunc().then(mod => mod.default || mod);
    component.displayName = 'DynamicComponent';
    return component;
  },
}));

// Mock next/image
jest.mock('next/image', () => {
  const MockNextImage = ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
  MockNextImage.displayName = 'NextImage';
  return MockNextImage;
});

// Mock sanity client
jest.mock('./lib/sanity', () => ({
  getFeaturedRecipes: jest.fn().mockResolvedValue([]),
  getAllRecipes: jest.fn().mockResolvedValue([]),
  getRecipeBySlug: jest.fn().mockResolvedValue(null),
  getAllSlugs: jest.fn().mockResolvedValue([]),
  client: {
    fetch: jest.fn().mockResolvedValue([]),
  },
  urlFor: jest.fn().mockReturnValue({
    url: () => 'https://example.com/image.jpg',
  }),
}));

// Mock portable text renderer
jest.mock('./lib/portableTextRenderer', () => ({
  renderPortableText: jest.fn().mockImplementation((content) => {
    if (typeof content === 'string') {
      return <div>{content}</div>;
    }
    return <div>Portable Text Content</div>;
  }),
}));

// Global test utilities
global.mockRouter = {
  route: '/',
  pathname: '',
  query: {},
  asPath: '',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
};