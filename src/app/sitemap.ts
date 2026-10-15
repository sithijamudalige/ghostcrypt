import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Regenerate sitemap at most once per hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://netcad.company';

  // Fetch all published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('id, created_at, is_lab')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const articleEntries: MetadataRoute.Sitemap = (articles || []).map((art) => ({
    url: `${baseUrl}/blog/${art.id}`,
    lastModified: art.created_at ? new Date(art.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: art.is_lab ? 0.6 : 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/labs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...articleEntries];
}
