"use client";
import React, { useEffect, useState } from 'react';
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

        <section className="content-section" style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
          {article.content}
        </section>
      </main>
    </>
  );
}
