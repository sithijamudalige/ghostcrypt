const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

function findMatchingArticle(labTitle, fullArticles) {
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
  if (norm.includes('telemetry') || norm.includes('tire') || norm.includes('traces')) {
    return fullArticles.find(a => a.title.toLowerCase().includes('telemetry'));
  }
  return null;
}

async function test() {
  const [{ data: labs }, { data: fullArticles }] = await Promise.all([
    supabase.from('articles').select('id, title').eq('status', 'published').eq('is_lab', true),
    supabase.from('articles').select('id, title').eq('status', 'published').eq('is_lab', false)
  ]);
  for (const l of labs) {
    const matched = findMatchingArticle(l.title, fullArticles);
    console.log(l.title, '==>', matched ? matched.title + ' (' + matched.id + ')' : 'NONE');
  }
  process.exit(0);
}
test();
