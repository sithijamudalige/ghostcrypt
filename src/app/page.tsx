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
      .substring(0, 100);
  };

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <header style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 className="title" style={{ fontSize: '3.5rem' }}>Welcome to NETCAD</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore our latest networking articles, hands-on packet tracer labs, and data science resources.
        </p>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading articles...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gridAutoRows: '380px',
            gap: '1.5rem',
            marginTop: '2rem' 
          }}>
            {articles.map((article, index) => {
              const thumbnailUrl = extractImage(article.content);
              const isFeatured = index === 0 && thumbnailUrl; // First article is featured if it has an image
              
              return (
                <Link key={article.id} href={`/blog/${article.id}`} style={{ 
                  display: 'block',
                  textDecoration: 'none',
                  gridColumn: isFeatured ? '1 / -1' : 'auto',
                  gridRow: isFeatured ? 'span 2' : 'span 1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="msn-card"
                >
                  {thumbnailUrl ? (
                    <>
                      <img src={thumbnailUrl} alt="Article Thumbnail" style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        zIndex: 0
                      }} />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        background: 'linear-gradient(to top, rgba(11,15,25,1) 0%, rgba(11,15,25,0.8) 40%, rgba(11,15,25,0) 100%)',
                        zIndex: 1
                      }}></div>
                    </>
                  ) : (
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent)',
                      zIndex: 0
                    }}></div>
                  )}

                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    width: '100%', 
                    padding: isFeatured ? '3rem' : '1.5rem', 
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '100%'
                  }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {article.profiles?.full_name || article.profiles?.email || 'Anonymous'} &bull; {new Date(article.created_at).toLocaleDateString()}
                    </p>
                    <h2 style={{ 
                      fontSize: isFeatured ? '2.5rem' : '1.5rem', 
                      lineHeight: '1.2', 
                      marginBottom: '0.5rem',
                      color: '#ffffff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {article.title}
                    </h2>
                    <p style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      lineHeight: 1.5, 
                      fontSize: isFeatured ? '1.1rem' : '0.95rem',
                      display: '-webkit-box',
                      WebkitLineClamp: isFeatured ? 3 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {cleanSnippet(article.content)}...
                    </p>
                  </div>
                </Link>
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
      
      <style dangerouslySetInnerHTML={{__html: `
        .msn-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,229,255,0.2) !important;
        }
        .msn-card:hover img {
          transform: scale(1.05);
          transition: transform 0.5s ease;
        }
        .msn-card img {
          transition: transform 0.5s ease;
        }
      `}} />
    </>
  );
}
