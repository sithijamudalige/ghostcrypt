"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // If the user just logged in via OAuth, redirect them to the dashboard immediately
    if (typeof window !== 'undefined' && localStorage.getItem('is_logging_in') === 'true') {
      localStorage.removeItem('is_logging_in');
      router.push('/dashboard');
      return;
    }

    const fetchArticles = async () => {
      const { data } = await supabase
        .from('articles')
        .select('*, profiles(full_name, email)')
        .eq('status', 'published')
        .eq('is_lab', false)
        .order('created_at', { ascending: false });
      
      if (data) setArticles(data);
    };

    fetchArticles();
  }, [router]);

  const extractImage = (content: string) => {
    // Extract first markdown image
    const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (mdMatch) return mdMatch[1];
    
    // Extract first HTML image
    const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (htmlMatch) return htmlMatch[1];
    
    return null;
  };

  const cleanSnippet = (content: string) => {
    return content
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove Markdown images
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags
      .replace(/(?:⬇️\s*)?Download Lab:.*?https:\/\/\S+/g, '') // Remove Lab links
      .replace(/#+\s/g, '') // Remove Markdown headers
      .replace(/\s+/g, ' ') // Squash multiple spaces
      .trim()
      .substring(0, 180);
  };

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <header style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 className="title" style={{ fontSize: '3.5rem' }}>Welcome to NETCAD</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore our latest cybersecurity articles, hands-on packet tracer labs, and networking resources.
        </p>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading articles...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem',
            marginTop: '2rem' 
          }}>
            {articles.map(article => {
              const thumbnailUrl = extractImage(article.content);
              return (
                <div key={article.id} className="glass-panel" style={{ 
                  margin: 0, 
                  maxWidth: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: 0,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', lineHeight: '1.3', marginBottom: '1rem' }}>
                        <Link href={`/blog/${article.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{article.title}</Link>
                      </h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '1rem' }}>
                        By {article.profiles?.full_name || article.profiles?.email || 'Anonymous'} &bull; {new Date(article.created_at).toLocaleDateString()}
                      </p>
                      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '0.95rem' }}>
                        {cleanSnippet(article.content)}...
                      </p>
                    </div>
                    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <Link href={`/blog/${article.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>Read Full Article <span style={{ fontSize: '1.2rem' }}>&rarr;</span></Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 10, paddingBottom: '2rem' }}>
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
