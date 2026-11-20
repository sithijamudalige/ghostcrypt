import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import ArticleLikeButton from '@/components/ArticleLikeButton';
import ArticleMetricsBadge from '@/components/ArticleMetricsBadge';

export const revalidate = 60;

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
    return { title: 'Article Not Found | NETCAD' };
  }

  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const isThinContent = article.is_lab || wordCount < 250;

  return {
    title: `${article.title} | NETCAD`,
    description: article.content.substring(0, 160).replace(/<[^>]+>/g, '').replace(/!\[.*?\]\(.*?\)/g, '').replace(/\s+/g, ' ').trim() + '...',
    robots: {
      index: !isThinContent,
      follow: true,
    }
  };
}

export default async function ArticleView(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { data: article, error } = await supabase
    .from('articles')
    .select('*, profiles(full_name, email)')
    .eq('id', id)
    .single();

  if (error || !article) {
    notFound();
  }

  // If a lab download post is directly accessed, redirect user to the rich Labs hub
  if (article.is_lab) {
    redirect('/labs');
  }

  const extractImage = (content: string) => {
    const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (mdMatch) return mdMatch[1];
    const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (htmlMatch) return htmlMatch[1];
    return null;
  };

  const coverImage = extractImage(article.content);

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main style={{ marginTop: '2rem', marginBottom: '4rem', padding: '2rem', maxWidth: '1000px', margin: '2rem auto', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: '1.2' }}>{article.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <p className="subtitle" style={{ margin: 0 }}>
            By {article.profiles?.full_name || article.profiles?.email || 'NETCAD Editorial Team'} &bull; {new Date(article.created_at).toLocaleDateString()}
          </p>
          <ArticleMetricsBadge articleId={article.id} createdAt={article.created_at} variant="inline" />
        </div>
        
        {coverImage && (
          <div style={{ marginBottom: '2.5rem', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <img src={coverImage} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}
        
        {article.youtube_id && (
          <div style={{ marginTop: '2rem', position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
            <iframe 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              src={`https://www.youtube.com/embed/${article.youtube_id}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        )}

        <section className="content-section article-content" style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '2rem', lineHeight: 1.8 }}>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              head: () => <></>,
              title: () => <></>,
              meta: () => <></>,
              style: ({node, ...props}: any) => {
                return <style dangerouslySetInnerHTML={{ __html: props.children }} />;
              },
              pre: ({node, children, ...props}) => (
                <pre style={{ 
                  background: 'rgba(0,0,0,0.5)', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  overflowX: 'auto', 
                  maxWidth: '100%',
                  border: '1px solid var(--glass-border)', 
                  color: '#38bdf8', 
                  fontFamily: 'Consolas, Monaco, monospace', 
                  fontSize: '13px', 
                  lineHeight: '1.45',
                  marginBottom: '1.5rem' 
                }}>{children}</pre>
              ),
              code: ({node, inline, children, ...props}: any) => (
                inline ? 
                  <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#38bdf8', fontSize: '0.9rem' }}>{children}</code> 
                  : <code>{children}</code>
              ),
              img: ({node, src, alt, ...props}) => (
                <img src={src} alt={alt || 'Article Image'} style={{maxWidth: '100%', height: 'auto', borderRadius: '12px', marginTop: '1rem', marginBottom: '1rem', boxShadow: '0 0 15px rgba(0, 229, 255, 0.1)', display: 'block'}} />
              ),
              p: ({node, children, ...props}) => <p style={{marginBottom: '1rem', maxWidth: '100%', overflowWrap: 'break-word'}}>{children}</p>,
              a: ({node, children, href, ...props}) => <a href={href} style={{color: 'var(--accent)'}} target="_blank" rel="noopener noreferrer">{children}</a>
            }}
          >
            {article.content}
          </ReactMarkdown>
        </section>

        {/* Interactive Like Button & Total Views */}
        <ArticleLikeButton articleId={article.id} />

        {/* Author Bio & E-E-A-T Box */}
        <section style={{ 
          marginTop: '3.5rem', 
          padding: '2rem', 
          background: 'rgba(0,0,0,0.4)', 
          borderRadius: '12px', 
          border: '1px solid var(--glass-border)',
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent) 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#000',
            flexShrink: 0
          }}>
            SM
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ margin: '0 0 0.3rem 0', color: '#fff', fontSize: '1.2rem' }}>
              Written by Sithija Mudalige
            </h3>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
              Founder & Network Systems Specialist at NETCAD
            </p>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Specializing in enterprise routing protocols, Cisco CCNA architectures, and practical virtual lab design. All Cisco Packet Tracer configurations and topologies on NETCAD are simulated and verified before publication.
            </p>
          </div>
        </section>

        {/* Back navigation & related links */}
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            &larr; Back to All Articles
          </Link>
          <Link href="/labs" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
            Explore Hands-On Labs &rarr;
          </Link>
        </div>
      </main>
    </>
  );
}
