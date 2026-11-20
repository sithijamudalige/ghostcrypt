"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface DownloadItem {
  label: string;
  url: string;
  type: 'pdf' | 'pkt' | 'ipynb' | 'other';
}

interface LabItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles?: { full_name?: string; email?: string } | null;
  downloads: DownloadItem[];
  description: string;
  matchedArticle: { id: string; title: string } | null;
}

interface LabsClientViewProps {
  initialLabs: LabItem[];
}

export default function LabsClientView({ initialLabs }: LabsClientViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pkt' | 'pdf' | 'ipynb' | 'routing' | 'switching'>('all');

  const filteredLabs = useMemo(() => {
    return initialLabs.filter(lab => {
      // 1. Search Query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        lab.title.toLowerCase().includes(q) ||
        lab.description.toLowerCase().includes(q) ||
        lab.downloads.some(d => d.label.toLowerCase().includes(q) || d.type.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 2. Category / Type filter
      if (activeFilter === 'pkt') {
        return lab.downloads.some(d => d.type === 'pkt') || lab.title.toLowerCase().includes('pkt') || lab.title.toLowerCase().includes('packet tracer');
      }
      if (activeFilter === 'pdf') {
        return lab.downloads.some(d => d.type === 'pdf') || lab.title.toLowerCase().includes('pdf') || lab.title.toLowerCase().includes('guide');
      }
      if (activeFilter === 'ipynb') {
        return lab.downloads.some(d => d.type === 'ipynb') || lab.title.toLowerCase().includes('python') || lab.title.toLowerCase().includes('telemetry');
      }
      if (activeFilter === 'routing') {
        const t = lab.title.toLowerCase();
        return t.includes('routing') || t.includes('router') || t.includes('roas') || t.includes('ivr') || t.includes('static');
      }
      if (activeFilter === 'switching') {
        const t = lab.title.toLowerCase();
        return t.includes('vlan') || t.includes('vtp') || t.includes('stp') || t.includes('spanning') || t.includes('etherchannel') || t.includes('switch');
      }

      return true;
    });
  }, [initialLabs, searchQuery, activeFilter]);

  const filterTabs = [
    { id: 'all', label: 'All Labs', icon: '⚡' },
    { id: 'pkt', label: 'Packet Tracer (.pkt)', icon: '🔌' },
    { id: 'pdf', label: 'Config Guides (.pdf)', icon: '📄' },
    { id: 'ipynb', label: 'Python & Data (.ipynb)', icon: '🐍' },
    { id: 'routing', label: 'Routing', icon: '🛣️' },
    { id: 'switching', label: 'Switching & VLANs', icon: '🔀' },
  ] as const;

  return (
    <div>
      {/* Search Bar & Filters Section */}
      <div style={{ maxWidth: '900px', margin: '0 auto 3rem auto' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#1a1f2c', 
          borderRadius: '50px', 
          padding: '0.6rem 1.4rem', 
          border: '1px solid rgba(0, 229, 255, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 229, 255, 0.1)',
          marginBottom: '1.2rem',
          transition: 'all 0.2s ease'
        }}>
          <span style={{ fontSize: '1.3rem', marginRight: '0.8rem', opacity: 0.8 }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search labs by topic (STP, VLAN, Routing), protocol, or file type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#ffffff', 
              width: '100%', 
              padding: '0.4rem 0',
              outline: 'none',
              fontSize: '1.05rem'
            }} 
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.2rem 0.6rem'
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Filter Badges */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  background: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#000' : '#cbd5e1',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 229, 255, 0.4)' : 'none'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          Showing <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{filteredLabs.length}</span> verified labs
          {(searchQuery || activeFilter !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                marginLeft: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.85rem'
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Lab Grid */}
      {filteredLabs.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '4rem 0', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <p style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.5rem' }}>No lab files found</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            No lab matches your search for "{searchQuery}". Try searching for STP, VLAN, Routing, or .pkt.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
            style={{
              background: 'var(--accent)',
              color: '#000',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Show All Labs
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', 
          gap: '2rem', 
          marginTop: '1rem' 
        }}>
          {filteredLabs.map((lab) => {
            const authorName = lab.profiles?.full_name || 'Sithija Mudalige';
            const dateStr = new Date(lab.created_at).toLocaleDateString();

            let badgeText = 'Cisco Packet Tracer Lab';
            if (lab.downloads.some(d => d.type === 'pdf') && !lab.downloads.some(d => d.type === 'pkt')) {
              badgeText = 'PDF Lab Guide';
            } else if (lab.downloads.some(d => d.type === 'ipynb')) {
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
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
                    {lab.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  {lab.downloads.length > 0 && (
                    <>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.8rem' }}>
                        Download Lab Files:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem' }}>
                        {lab.downloads.map((dl, i) => (
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

                  {lab.matchedArticle ? (
                    <Link 
                      href={`/blog/${lab.matchedArticle.id}`} 
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
                      Read Full Configuration Guide &rarr;
                    </Link>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      ✓ Verified Lab Configuration
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
