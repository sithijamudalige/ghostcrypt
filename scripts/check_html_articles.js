const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  const { data } = await supabase.from('articles').select('title, content').in('id', [
    '4b2cb381-7a15-4e34-a203-42e92275aeb9',
    '262a64ee-436b-4b3c-8fee-eb89bcdba307',
    'bada2d68-d703-4608-b3af-1cdde1f5c2da',
    '70dfc559-7caa-4d20-91cc-4aeda8b8ed49'
  ]);
  for (const a of data) {
    console.log('=== ' + a.title + ' ===');
    console.log(a.content.substring(0, 300));
    console.log('\n');
  }
}
check();
