import type { MetadataRoute } from 'next';

// ISR: regenerate sitemap every hour
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://coupon.pantum.in.th';
  const lastModified = new Date('2025-01-01');

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/validate-coupon`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/generate-coupon`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/purchase-demo`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
