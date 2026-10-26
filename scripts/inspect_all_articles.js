const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function inspectArticles() {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, content, is_lab, created_at')
    .eq('status', 'published')
    .eq('is_lab', false)
    .order('created_at', { ascending: false });

  console.log(`=== Inspecting ${articles.length} Published Articles ===\n`);
  for (const a of articles) {
    const wc = a.content ? a.content.split(/\s+/).length : 0;
    const hasCode = /```/.test(a.content || '');
    const hasImages = /!\[.*?\]\(.*?\)|<img/.test(a.content || '');
    const headings = (a.content || '').match(/^#{1,3}\s+.+$/gm) || [];
    console.log(`Title: ${a.title}`);
    console.log(`ID: ${a.id}`);
    console.log(`Word Count: ${wc}`);
    console.log(`Has Code Blocks: ${hasCode}`);
    console.log(`Has Images: ${hasImages}`);
    console.log(`Headings count: ${headings.length}`);
    console.log(`Snippet: ${(a.content || '').substring(0, 150).replace(/\n/g, ' ')}...`);
    console.log('--------------------------------------------------\n');
  }
}
inspectArticles();
