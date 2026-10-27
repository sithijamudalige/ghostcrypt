const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function testFetch() {
  const { data: labs } = await supabase
    .from('articles')
    .select('id, title, content, created_at, profiles(full_name, email)')
    .eq('status', 'published')
    .eq('is_lab', true)
    .order('created_at', { ascending: false });

  console.log('Fetched labs count:', labs ? labs.length : 0);
  for (const lab of labs) {
    const urls = [];
    const hrefRegex = /href=["']([^"']+)["']/g;
    let match;
    while ((match = hrefRegex.exec(lab.content || '')) !== null) {
      urls.push(match[1]);
    }
    console.log(lab.title, '=> URLs:', urls);
  }
}
testFetch();
