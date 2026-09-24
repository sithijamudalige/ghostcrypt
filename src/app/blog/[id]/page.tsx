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

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel legal-panel" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1>{article.title}</h1>
        <p className="subtitle">By {article.profiles?.full_name || article.profiles?.email || 'Anonymous'} &bull; {new Date(article.created_at).toLocaleDateString()}</p>
        
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
              style: () => <></>,
              head: () => <></>,
              title: () => <></>,
              meta: () => <></>,
              img: ({node, ...props}) => <img style={{maxWidth: '100%', height: 'auto', borderRadius: '12px', marginTop: '1rem', marginBottom: '1rem', boxShadow: '0 0 15px rgba(0, 229, 255, 0.1)'}} {...props} />,
              p: ({node, ...props}) => <p style={{marginBottom: '1rem'}} {...props} />,
              a: ({node, ...props}) => <a style={{color: 'var(--accent)'}} target="_blank" {...props} />
            }}
          >
            {article.content}
          </ReactMarkdown>
        </section>
      </main>
    </>
  );
}
