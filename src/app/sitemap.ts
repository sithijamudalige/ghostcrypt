import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://netcad.company';

  // Fetch only high-value, comprehensive published articles (excluding thin lab download items)
  const { data: articles } = await supabase
    .from('articles')
    .select('id, created_at, content')
    .eq('status', 'published')
    .eq('is_lab', false)
    .order('created_at', { ascending: false });

  const validArticles = (articles || []).filter(art => {
    const wordCount = art.content ? art.content.split(/\s+/).filter(Boolean).length : 0;
    return wordCount >= 250;
  });

  const articleEntries: MetadataRoute.Sitemap = validArticles.map((art) => ({
    url: `${baseUrl}/blog/${art.id}`,
    lastModified: art.created_at ? new Date(art.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
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
      url: `${baseUrl}/quizzes`,
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
