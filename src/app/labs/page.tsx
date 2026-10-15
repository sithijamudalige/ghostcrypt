import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Hands-On Labs | NETCAD',
  description: 'Download interactive Cisco Packet Tracer (.pkt) labs and Jupyter Notebooks for hands-on networking practice.',
};

export default async function LabsIndex() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*, profiles(full_name, email)')
    .eq('status', 'published')
    .eq('is_lab', true)
    .order('created_at', { ascending: false });

  const labList = articles || [];

  return (
    <main style={{ marginTop: '2rem', marginBottom: '4rem', padding: '0 2rem', maxWidth: '1400px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Hands-On Labs</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', margin: 0 }}>
          Interactive Cisco Packet Tracer (.pkt) configurations and telemetry experiments.
        </p>
      </div>
      
      {labList.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>No lab files have been published yet.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', 
          gap: '2rem', 
          marginTop: '2rem' 
        }}>
          {labList.map(article => (
            <div key={article.id} className="glass-panel" style={{ 
              margin: 0, 
              maxWidth: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem',
              borderLeft: '4px solid var(--accent)'
            }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', lineHeight: '1.3', marginBottom: '1rem' }}>
                  <Link href={`/blog/${article.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{article.title}</Link>
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '1rem' }}>
                  By {article.profiles?.full_name || article.profiles?.email || 'NETCAD Editorial Team'} &bull; {new Date(article.created_at).toLocaleDateString()}
                </p>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  {article.content.replace(/<[^>]+>/g, ' ').replace(/(?:⬇️\s*)?Download Lab:.*?https:\/\/\S+/g, '').replace(/(?:⬇️\s*)?Download Lab:.*?(?=\s|$)/g, '').replace(/\s+/g, ' ').trim().substring(0, 180)}...
                </p>
              </div>
              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Link href={`/blog/${article.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>Open Lab Guide <span style={{ fontSize: '1.2rem' }}>&rarr;</span></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
