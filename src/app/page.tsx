"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function BlogIndex() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
      router.push('/dashboard');
      return;
    }
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, profiles(full_name, email)')
        .eq('status', 'published')
        .eq('is_lab', false)
        .order('created_at', { ascending: false });
      
      if (data) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <>
      <main style={{ marginTop: '2rem', marginBottom: '4rem', padding: '0 2rem', maxWidth: '1400px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Latest Articles</h1>
          <p className="subtitle" style={{ fontSize: '1.2rem', margin: 0 }}>Insights, labs, and guides published by our community</p>
        </div>
        
        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading articles...</p>
        ) : articles.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No articles published yet. Be the first!</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', 
            gap: '2rem', 
            marginTop: '2rem' 
          }}>
            {articles.map(article => (
              <div key={article.id} className="glass-panel" style={{ 
                margin: 0, 
                maxWidth: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', lineHeight: '1.3', marginBottom: '1rem' }}>
                    <Link href={`/blog/${article.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{article.title}</Link>
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '1rem' }}>
                    By {article.profiles?.full_name || article.profiles?.email || 'Anonymous'} &bull; {new Date(article.created_at).toLocaleDateString()}
                  </p>
                  <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {article.content.replace(/<[^>]+>/g, ' ').replace(/(?:⬇️\s*)?Download Lab:.*?https:\/\/\S+/g, '').replace(/(?:⬇️\s*)?Download Lab:.*?(?=\s|$)/g, '').replace(/\s+/g, ' ').trim().substring(0, 180)}...
                  </p>
                </div>
                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <Link href={`/blog/${article.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>Read Full Article <span style={{ fontSize: '1.2rem' }}>&rarr;</span></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 10, paddingBottom: '2rem' }}>
        <p>&copy; {new Date().getFullYear()} Developed and All Rights Reserved by NETCAD.</p>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Login / Dashboard</a>
          <a href="/quizzes" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Quizzes</a>
          <a href="/encrypt" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Encryption Tool</a>
        </div>
      </footer>
    </>
  );
}
