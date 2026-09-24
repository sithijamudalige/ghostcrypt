"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BlogIndex() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
      
      if (data) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <>
      <main className="glass-panel legal-panel" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <h1 style={{ marginTop: '1rem' }}>NEDCAD Community Articles</h1>
        <p className="subtitle">Latest insights published by our community</p>
        
        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading articles...</p>
        ) : articles.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No articles published yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            {articles.map(article => (
              <div key={article.id} className="content-section" style={{ background: 'rgba(0,0,0,0.4)', marginTop: 0 }}>
                <h2><Link href={`/blog/${article.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{article.title}</Link></h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  By {article.profiles?.full_name || article.profiles?.email || 'Anonymous'} &bull; {new Date(article.created_at).toLocaleDateString()}
                </p>
                <p style={{ marginTop: '1rem' }}>
                  {article.content.substring(0, 150)}...
                </p>
                <Link href={`/blog/${article.id}`} style={{ color: 'var(--accent)' }}>Read Full Article &rarr;</Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 10, paddingBottom: '2rem' }}>
        <p>&copy; {new Date().getFullYear()} Developed and All Rights Reserved by NEDCAD.</p>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Login / Dashboard</a>
          <a href="/quizzes" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Quizzes</a>
          <a href="/encrypt" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Encryption Tool</a>
        </div>
      </footer>
    </>
  );
}
