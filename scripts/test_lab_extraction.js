const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

function extractDownloads(content) {
  if (!content) return [];
  const downloads = [];
  const seenUrls = new Set();

  const aRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  while ((match = aRegex.exec(content)) !== null) {
    const url = match[1].trim();
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    const rawLabel = match[2].replace(/<[^>]+>/g, '').trim();
    
    let type = 'other';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.pdf')) type = 'pdf';
    else if (lowerUrl.includes('.pkt')) type = 'pkt';
    else if (lowerUrl.includes('.ipynb')) type = 'ipynb';

    const label = rawLabel || (type === 'pdf' ? '📄 Download Config PDF' : type === 'pkt' ? '⬇️ Download Packet Tracer (.pkt)' : type === 'ipynb' ? '🐍 Download Notebook (.ipynb)' : '⬇️ Download Lab File');

    downloads.push({ label, url, type });
  }

  return downloads;
}

function extractDescription(content) {
  if (!content) return 'Lab files, Packet Tracer topologies, and step-by-step configuration guides.';
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
    return 'Downloadable lab topologies, configuration workbooks, and practice exercises.';
  }
  return cleaned.length > 180 ? cleaned.substring(0, 180) + '...' : cleaned;
}

async function run() {
  const { data: labs } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('is_lab', true)
    .order('created_at', { ascending: false });

  console.log('Found published labs:', labs.length);
  for (const l of labs) {
    console.log('LAB:', l.title);
    console.log('Desc:', extractDescription(l.content));
    console.log('Downloads:', extractDownloads(l.content));
    console.log('-------------------------------');
  }
}
run();
