import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import LabsClientView from '@/components/LabsClientView';

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

function findMatchingArticle(labTitle: string, fullArticles: { id: string; title: string }[]) {
  const norm = labTitle.toLowerCase();
  if (norm.includes('stp') || norm.includes('spanning tree')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('spanning tree'));
  }
  if (norm.includes('cisco') && (norm.includes('free') || norm.includes('lab'))) {
    return fullArticles.find(a => a.title.toLowerCase().includes('cisco labs'));
  }
  if (norm.includes('roas') || norm.includes('router on stick')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('roas'));
  }
  if (norm.includes('ivr') || norm.includes('inter-vlan')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('inter-vlan'));
  }
  if (norm.includes('vtp')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('vtp'));
  }
  if (norm.includes('vlan')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('virtual local area network'));
  }
  if (norm.includes('etherchannel')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('etherchannel'));
  }
  if (norm.includes('telemetry') || norm.includes('tire') || norm.includes('traces') || norm.includes('f1')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('telemetry'));
  }
  if (norm.includes('routing')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('routing'));
  }
  // Generic fallback: check if any article title shares keywords
  const words = norm.split(/\s+/).filter(w => w.length > 3);
  for (const w of words) {
    const found = fullArticles.find(a => a.title.toLowerCase().includes(w));
    if (found) return found;
  }
  return null;
}

export default async function LabsIndex() {
  const [{ data: labs }, { data: fullArticles }] = await Promise.all([
    supabase
      .from('articles')
      .select('*, profiles(full_name, email)')
      .eq('status', 'published')
      .eq('is_lab', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('articles')
      .select('id, title')
      .eq('status', 'published')
      .eq('is_lab', false)
  ]);

  const labList = labs || [];
  const articlesList = fullArticles || [];

  const formattedLabs = labList.map((lab) => ({
    id: lab.id,
    title: lab.title,
    content: lab.content,
    created_at: lab.created_at,
    profiles: lab.profiles,
    downloads: extractDownloads(lab.content),
    description: extractDescription(lab.content),
    matchedArticle: findMatchingArticle(lab.title, articlesList) || null,
  }));

  return (
    <main style={{ marginTop: '2rem', marginBottom: '4rem', padding: '0 2rem', maxWidth: '1400px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Hands-On Networking & Telemetry Labs</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', margin: '0 auto', maxWidth: '800px', lineHeight: 1.6 }}>
          Practice real-world network engineering and data analysis with verified Cisco Packet Tracer (<code style={{ color: 'var(--accent)' }}>.pkt</code>) topologies, PDF CLI configuration workbooks, and Jupyter Notebooks.
        </p>
      </div>

      <LabsClientView initialLabs={formattedLabs} />
    </main>
  );
}
