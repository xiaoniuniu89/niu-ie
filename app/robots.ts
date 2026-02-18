import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/keystatic', '/api/keystatic'],
    },
    sitemap: 'https://www.niu.ie/sitemap.xml',
  }
}
