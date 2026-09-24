"use client";
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await supabase
        .from('articles')
        .select('*, profiles(full_name, email)')
        .eq('id', id)
        .single();
      
      setArticle(data);
      setLoading(false);
    };
    if (id) fetchArticle();
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;
  if (!article) return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Article not found</div>;

  const extractImage = (content: string) => {
    const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (mdMatch) return mdMatch[1];
    const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (htmlMatch) return htmlMatch[1];
    return null;
  };
  
  const coverImage = extractImage(article.content);
  // We don't remove the image from the content so they can still see it in context, but we add it as a banner
  
  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main style={{ marginTop: '2rem', marginBottom: '4rem', padding: '2rem', maxWidth: '1000px', margin: '2rem auto', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: '1.2' }}>{article.title}</h1>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>By {article.profiles?.full_name || article.profiles?.email || 'Anonymous'} &bull; {new Date(article.created_at).toLocaleDateString()}</p>
        
        {coverImage && (
          <div style={{ marginBottom: '2.5rem', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <img src={coverImage} alt="Cover" style={{ width: '100%', height: 'auto', display: 'block' }} />
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
              a: ({node, children, href, ...props}) => <a href={href} style={{color: 'var(--accent)'}} target="_blank">{children}</a>
            }}
          >
            {article.content}
          </ReactMarkdown>
        </section>
      </main>
    </>
  );
}
