const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function attachNewLabs() {
  // 1. STP Article
  const stpId = '0676f611-ea52-447d-9b60-57dc8dafdb2f';
  const { data: stpArt } = await supabase.from('articles').select('content').eq('id', stpId).single();
  if (stpArt && !stpArt.content.includes('3fjm399b3s8_STP.pkt')) {
    const stpAttachment = `

---

## 🛠️ Hands-On Cisco Packet Tracer Lab: Spanning Tree Protocol (STP)

Practice Root Bridge elections, designated/root port selection, and blocking state convergence directly inside Cisco Packet Tracer. Download the pre-built topology below:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/3fjm399b3s8_STP.pkt" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Download STP Lab (.pkt)
  </a>
</div>
`;
    await supabase.from('articles').update({ content: stpArt.content + stpAttachment }).eq('id', stpId);
    console.log('Attached STP lab to SPANNING TREE PROTOCOL article!');
  } else {
    console.log('STP already attached or not found.');
  }

  // 2. Official Cisco Free Labs Article
  const ciscoId = 'a005dfc8-9712-4886-b39e-4a607b61c8d2';
  const { data: ciscoArt } = await supabase.from('articles').select('content').eq('id', ciscoId).single();
  if (ciscoArt && !ciscoArt.content.includes('Cisco%20Free%20Labs%20Setup%20Guide.pdf')) {
    const ciscoAttachment = `

---

## 📄 Download the Official Cisco Free Labs Setup Guide (PDF)

Get the complete, step-by-step setup documentation, hardware requirements, and practice exercises in an easy-to-read offline PDF manual:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/pik59x61tj_Cisco%20Free%20Labs%20Setup%20Guide.pdf" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #fbbf24; color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    📄 Download Setup Guide (PDF)
  </a>
</div>
`;
    await supabase.from('articles').update({ content: ciscoArt.content + ciscoAttachment }).eq('id', ciscoId);
    console.log('Attached PDF setup guide to Official Cisco Free Labs article!');
  } else {
    console.log('Cisco setup guide already attached or not found.');
  }
}

attachNewLabs();
