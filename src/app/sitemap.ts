import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adhdly.app';
  const routes = [
    '',
    '/features',
    '/faq',
    '/llms.txt',
    '/llms-full.txt',
    '/privacy',
    '/terms',
    '/accessibility'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
