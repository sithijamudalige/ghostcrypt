"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
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
    const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (mdMatch) return mdMatch[1];
    const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (htmlMatch) return htmlMatch[1];
    return null;
  };

  const cleanSnippet = (content: string) => {
    return content
      .replace(/!\[.*?\]\(.*?\)/g, '') 
      .replace(/<[^>]+>/g, ' ') 
      .replace(/(?:⬇️\s*)?Download Lab:.*?https:\/\/\S+/g, '') 
      .replace(/#+\s/g, '') 
      .replace(/\s+/g, ' ') 
      .trim()
      .substring(0, 100);
  };

  const currentTime = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div style={{ background: '#121212', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="orb orb-1" style={{ opacity: 0.3 }}></div>
      <div className="orb orb-2" style={{ opacity: 0.3 }}></div>

      {/* MSN Style Top Header */}
      <div style={{ width: '100%', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#1e1e1e', 
          borderRadius: '24px', 
          padding: '0.5rem 1.5rem', 
          width: '100%', 
          maxWidth: '800px',
          border: '1px solid #333'
        }}>
          <span style={{ fontSize: '1.2rem', marginRight: '1rem', opacity: 0.5 }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search articles, networking, data science..." 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              width: '100%', 
              padding: '0.5rem 0',
              outline: 'none',
              fontSize: '1rem'
            }} 
          />
        </div>
      </div>

      {/* MSN Style Navigation */}
      <div style={{ width: '100%', padding: '0 2rem 1.5rem 2rem', display: 'flex', gap: '1.5rem', overflowX: 'auto', borderBottom: '1px solid #2a2a2a', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--accent)', color: 'black', padding: '0.4rem 1.2rem', borderRadius: '16px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>Discover</div>
        <div style={{ padding: '0.4rem 1.2rem', color: '#aaa', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer' }}>Networking</div>
        <div style={{ padding: '0.4rem 1.2rem', color: '#aaa', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer' }}>Data Science</div>
        <div style={{ padding: '0.4rem 1.2rem', color: '#aaa', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer' }}>Labs</div>
      </div>

      <main style={{ width: '100%', padding: '0 2rem' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading articles...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gridAutoRows: '320px',
            gap: '1.5rem',
            gridAutoFlow: 'dense'
          }}>
            
            {/* The MSN Grid Items */}
            {articles.map((article, index) => {
              const thumbnailUrl = extractImage(article.content);
              const isFeatured = index === 0 && thumbnailUrl && articles.length > 2;
              
              const articleCard = (
                <Link key={article.id} href={`/blog/${article.id}`} style={{ 
                  display: 'block',
                  textDecoration: 'none',
                  gridColumn: isFeatured ? 'span 2' : 'span 1',
                  gridRow: isFeatured ? 'span 2' : 'span 1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
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
                        height: isFeatured ? '100%' : '60%', 
                        objectFit: 'cover',
                        zIndex: 0
                      }} />
                      {isFeatured ? (
                        <div style={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%', 
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                          zIndex: 1
                        }}></div>
                      ) : (
                        <div style={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '40%', 
                          background: '#1a1a1a',
                          zIndex: 1
                        }}></div>
                      )}
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
                    padding: isFeatured ? '2rem' : '1.2rem', 
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: isFeatured ? '100%' : (thumbnailUrl ? '40%' : '100%')
                  }}>
                    <p style={{ fontSize: '0.75rem', color: isFeatured ? 'var(--accent)' : '#aaa', fontWeight: 'bold', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      {article.profiles?.full_name || article.profiles?.email || 'Anonymous'}
                    </p>
                    <h2 style={{ 
                      fontSize: isFeatured ? '2rem' : '1.1rem', 
                      lineHeight: '1.3', 
                      marginBottom: '0.5rem',
                      color: '#ffffff',
                      textShadow: isFeatured ? '0 2px 4px rgba(0,0,0,0.8)' : 'none',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {article.title}
                    </h2>
                    {isFeatured && (
                      <p style={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        lineHeight: 1.5, 
                        fontSize: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        {cleanSnippet(article.content)}...
                      </p>
                    )}
                  </div>
                </Link>
              );

              // Inject the Weather widget right after the featured article (index 0)
              if (index === 0) {
                return (
                  <React.Fragment key="weather-injection">
                    {articleCard}
                    <div style={{ 
                      gridColumn: 'span 1', 
                      gridRow: 'span 1', 
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
                      borderRadius: '16px', 
                      padding: '1.5rem', 
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: '1px solid #333',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                      <div>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                          <span>{days[currentTime.getDay()]}, {months[currentTime.getMonth()]} {currentTime.getDate()}</span>
                          <span>📍 Hanthana</span>
                        </p>
                        <h1 style={{ fontSize: '3rem', margin: '1rem 0 0 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          23° <span style={{ fontSize: '2rem' }}>⛅</span>
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Partly cloudy. High 26° Low 18°.</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>12 PM</p>
                          <p style={{ fontSize: '1.2rem', margin: '0.2rem 0' }}>☀️</p>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>25°</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>3 PM</p>
                          <p style={{ fontSize: '1.2rem', margin: '0.2rem 0' }}>⛅</p>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>24°</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>6 PM</p>
                          <p style={{ fontSize: '1.2rem', margin: '0.2rem 0' }}>☁️</p>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>21°</p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              }

              return articleCard;
            })}
          </div>
        )}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .msn-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 25px rgba(0,0,0,0.8) !important;
          border-color: var(--accent);
        }
      `}} />
    </div>
  );
}
