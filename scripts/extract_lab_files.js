const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function getLabFiles() {
  const { data: labs } = await supabase.from('articles').select('id, title, content').eq('is_lab', true);
  for (const lab of labs) {
    console.log(`ID: ${lab.id}`);
    console.log(`Title: ${lab.title}`);
    const urls = lab.content.match(/https:\/\/[^\s"']+/g) || [];
    console.log(`Files:`, urls);
    console.log('---');
  }
}
getLabFiles();
