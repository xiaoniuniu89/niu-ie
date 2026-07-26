import { MetadataRoute } from 'next'

const LOCALE_MAP: Record<string, string> = {
  enUs: 'en',
  ga: 'ga',
  zhCn: 'zh',
  de: 'de',
  es: 'es',
  fr: 'fr',
  pl: 'pl',
  ro: 'ro',
  uk: 'uk',
  lt: 'lt',
  pt: 'pt',
};

const LOCALES = Object.keys(LOCALE_MAP);

const ROUTES = [
  { path: '', priority: 1, changeFreq: 'monthly' as const },
  { path: '/portfolio', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/process', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFreq: 'yearly' as const },
  { path: '/digital-grants', priority: 0.7, changeFreq: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.niu.ie'

  const entries: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    const alternates: Record<string, string> = {};
    for (const locale of LOCALES) {
      alternates[LOCALE_MAP[locale]] = `${baseUrl}${route.path}`;
    }

    entries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFreq,
      priority: route.priority,
      alternates: {
        languages: alternates,
      },
    });
  }

  return entries;
}