import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Hands-On Labs & Cisco Packet Tracer Downloads | NETCAD',
  description: 'Download verified Cisco Packet Tracer (.pkt) labs, configuration PDF workbooks, and Jupyter Notebooks for hands-on networking and telemetry practice.',
};

interface DownloadItem {
  label: string;
  url: string;
  type: 'pdf' | 'pkt' | 'ipynb' | 'other';
}

function extractDownloads(content: string): DownloadItem[] {
  if (!content) return [];
  const downloads: DownloadItem[] = [];
  const seenUrls = new Set<string>();

  // Extract from HTML <a> tags: <a href="URL"...>Label</a>
  const aRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  while ((match = aRegex.exec(content)) !== null) {
    const url = match[1].trim();
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    const rawLabel = match[2].replace(/<[^>]+>/g, '').trim();
    
    let type: 'pdf' | 'pkt' | 'ipynb' | 'other' = 'other';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.pdf')) type = 'pdf';
    else if (lowerUrl.includes('.pkt')) type = 'pkt';
    else if (lowerUrl.includes('.ipynb')) type = 'ipynb';

    const label = rawLabel || (type === 'pdf' ? '📄 Download Config PDF' : type === 'pkt' ? '⬇️ Download Packet Tracer (.pkt)' : type === 'ipynb' ? '🐍 Download Notebook (.ipynb)' : '⬇️ Download Lab File');

    downloads.push({ label, url, type });
  }

  // Extract from Markdown links: [Label](URL)
  const mdRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/gi;
  while ((match = mdRegex.exec(content)) !== null) {
    const url = match[2].trim();
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    const rawLabel = match[1].trim();
    
    let type: 'pdf' | 'pkt' | 'ipynb' | 'other' = 'other';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.pdf')) type = 'pdf';
    else if (lowerUrl.includes('.pkt')) type = 'pkt';
    else if (lowerUrl.includes('.ipynb')) type = 'ipynb';

    downloads.push({
      label: rawLabel || '⬇️ Download Lab File',
      url,
      type
    });
  }

  return downloads;
}

function extractDescription(content: string): string {
  if (!content) return 'Downloadable lab topologies, configuration workbooks, and practice exercises.';
  const cleaned = content
    .replace(/<div[\s\S]*?<\/div>/gi, ' ')
    .replace(/<a[\s\S]*?<\/a>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/(?:⬇️|📄)?\s*Download Lab:.*?https:\/\/\S+/gi, '')
    .replace(/Direct Link:\s*https:\/\/\S+/gi, '')
    .replace(/#+\s/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned || cleaned.length < 10) {
    return 'Downloadable lab topologies, configuration workbooks, and hands-on practice exercises.';
  }
  return cleaned.length > 180 ? cleaned.substring(0, 180) + '...' : cleaned;
}

export default async function LabsIndex() {
  const { data: labs } = await supabase
    .from('articles')
    .select('*, profiles(full_name, email)')
    .eq('status', 'published')
    .eq('is_lab', true)
    .order('created_at', { ascending: false });

  const labList = labs || [];

  return (
    <main style={{ marginTop: '2rem', marginBottom: '4rem', padding: '0 2rem', maxWidth: '1400px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Hands-On Networking & Telemetry Labs</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', margin: '0 auto', maxWidth: '800px', lineHeight: 1.6 }}>
          Practice real-world network engineering and data analysis with verified Cisco Packet Tracer (<code style={{ color: 'var(--accent)' }}>.pkt</code>) topologies, PDF CLI configuration workbooks, and Jupyter Notebooks.
        </p>
      </div>

      {labList.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No lab files published yet.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', 
          gap: '2rem', 
          marginTop: '2rem' 
        }}>
          {labList.map((lab) => {
            const downloads = extractDownloads(lab.content);
            const description = extractDescription(lab.content);
            const authorName = lab.profiles?.full_name || 'Sithija Mudalige';
            const dateStr = new Date(lab.created_at).toLocaleDateString();

            // Determine category badge based on download file types
            let badgeText = 'Cisco Packet Tracer Lab';
            if (downloads.some(d => d.type === 'pdf') && !downloads.some(d => d.type === 'pkt')) {
              badgeText = 'PDF Lab Guide';
            } else if (downloads.some(d => d.type === 'ipynb')) {
              badgeText = 'Python & Telemetry';
            }

            return (
              <div 
                key={lab.id} 
                className="glass-panel" 
                style={{ 
                  margin: 0, 
                  maxWidth: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  padding: '2rem',
                  borderLeft: '4px solid var(--accent)',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', background: 'rgba(0, 229, 255, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                      {badgeText}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {dateStr}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.5rem', lineHeight: '1.3', marginBottom: '0.6rem', color: 'white' }}>
                    {lab.title}
                  </h2>

                  <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 600 }}>
                    By {authorName}
                  </p>

                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    {description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  {downloads.length > 0 && (
                    <>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.8rem' }}>
                        Download Lab Files:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem' }}>
                        {downloads.map((dl, i) => (
                          <a 
                            key={i} 
                            href={dl.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              background: 'rgba(0,0,0,0.5)', 
                              border: '1px solid var(--glass-border)',
                              padding: '11px 16px', 
                              borderRadius: '8px', 
                              color: dl.type === 'pdf' ? '#fbbf24' : dl.type === 'ipynb' ? '#c084fc' : 'var(--accent)',
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span>{dl.label}</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>⬇️ Download</span>
                          </a>
                        ))}
                      </div>
                    </>
                  )}

                  <Link 
                    href={`/blog/${lab.id}`} 
                    style={{ 
                      color: 'var(--accent)', 
                      textDecoration: 'none', 
                      fontWeight: 'bold', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      fontSize: '0.95rem'
                    }}
                  >
                    Open Lab Guide & Details &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
