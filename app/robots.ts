import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
export default function robots(): MetadataRoute.Robots {
  const url = getSiteUrl();
  return { rules: { userAgent: '*', ...(url ? { allow: '/', disallow: ['/api/'] } : { disallow: '/' }) }, ...(url ? { sitemap: `${url}/sitemap.xml` } : {}) };
}
