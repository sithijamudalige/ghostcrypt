const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function run() {
  const { data: art, error: fetchErr } = await supabase
    .from('articles')
    .select('content')
    .eq('id', '0a509b2f-942c-465f-a508-15900bd34c97')
    .single();

  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    process.exit(1);
  }

  if (art.content.includes('STATIC%20ROUTING.pkt')) {
    console.log('Already attached!');
    process.exit(0);
  }

  const appendBlock = `

---

## 🧪 Hands-On Practice Lab

Download the official Cisco Packet Tracer topology to practice static and dynamic route configurations:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/7qlfbymoo1d_STATIC%20ROUTING.pkt" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Download Lab (.pkt)
  </a>
</div>
`;

  const newContent = art.content + appendBlock;
  const { error: updateErr } = await supabase
    .from('articles')
    .update({ content: newContent })
    .eq('id', '0a509b2f-942c-465f-a508-15900bd34c97');

  if (updateErr) {
    console.error('Update error:', updateErr);
  } else {
    console.log('Successfully attached STATIC ROUTING.pkt to ROUTING FUNDAMENTALS article!');
  }
  process.exit(0);
}

run();
