import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const { data: article } = await supabase
    .from('articles')
    .select('title, content, is_lab')
    .eq('id', params.id)
    .single();

  if (!article) {
    return { title: 'Not Found' };
  }

  // Calculate word count
  const wordCount = article.content ? article.content.split(/\s+/).length : 0;

  // If the article is a lab or has fewer than 250 words, tell Google NOT to index it.
  // This prevents Google AdSense from rejecting the entire site for "Thin Content".
  const isThinContent = article.is_lab || wordCount < 250;

  return {
    title: `${article.title} - NETCAD`,
    description: article.content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
    robots: {
      index: !isThinContent,
      follow: true,
    }
  };
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
