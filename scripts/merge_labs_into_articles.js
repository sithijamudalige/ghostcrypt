const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const LAB_ATTACHMENTS = {
  // Inter-VLAN Routing (IVR)
  '4b2cb381-7a15-4e34-a203-42e92275aeb9': `

---

## 🛠️ Hands-On Cisco Packet Tracer Lab Files

Put theory into practice by testing this exact topology in Cisco Packet Tracer. Download the pre-built \`.pkt\` lab file and the complete step-by-step CLI configuration guide below:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/pt5swjfutvg_IVR.pkt" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Download Lab (.pkt)
  </a>
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/tjro2cy2019_InterVLAN_Routing_Lab.pdf" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--glass-border); padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    📄 Download Config PDF Guide
  </a>
</div>
`,

  // VLAN Trunking Protocol (VTP)
  'bada2d68-d703-4608-b3af-1cdde1f5c2da': `

---

## 🛠️ Hands-On Cisco Packet Tracer Lab Files

Test VTP Server, Client, and Transparent modes directly in your own virtual lab environment:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/hliyd8ar0g_VTP%20LAB%201.pkt" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Download VTP Lab (.pkt)
  </a>
</div>
`,

  // Virtual Local Area Network (VLAN)
  '70dfc559-7caa-4d20-91cc-4aeda8b8ed49': `

---

## 🛠️ Hands-On Cisco Packet Tracer Lab Files

Practice creating VLANs, assigning access ports, and configuring 802.1Q trunk links:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/b63cjxj2o8l_VLAN%20LAB%201.pkt" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Download VLAN Lab (.pkt)
  </a>
</div>
`,

  // EtherChannel
  '262a64ee-436b-4b3c-8fee-eb89bcdba307': `

---

## 🛠️ Hands-On Cisco Packet Tracer Lab Files

Configure LACP (802.3ad) and PAgP EtherChannel port bundles in Packet Tracer. Download the topology file and step-by-step PDF manual:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/qfsu5y8qjf_EtherChannel%20LAB1.pkt" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Download EtherChannel Lab (.pkt)
  </a>
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/2cuoy7468n6_CCNA%20200-301%20EtherChannel%20Lab%20Guide.pdf" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--glass-border); padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    📄 Download Lab Guide PDF
  </a>
</div>
`,

  // Router-on-a-Stick (ROAS)
  '2c7ebc7d-e0c7-46c7-9272-91250f2f247f': `

---

## 🛠️ Hands-On Cisco Packet Tracer Lab Files

Download the complete Router-on-a-Stick lab topology and official configuration guide:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/q5juka95mud_ROAS.pkt" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Download ROAS Lab (.pkt)
  </a>
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/ik0gwvvtahq_ROAS_Lab_Guide.pdf" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--glass-border); padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    📄 Download ROAS Guide PDF
  </a>
</div>
`,

  // Formula 1 Telemetry
  '63b701c7-82aa-4003-a134-627ec650261e': `

---

## 🛠️ Hands-On Python & Jupyter Notebook Telemetry Labs

Download the interactive Python data science notebooks to analyze live telemetry speed traces and tire degradation:

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/lydespj84fj_telemetry.ipynb" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Telemetry Analysis (.ipynb)
  </a>
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/5tj15brz04m_0_to_Hero_Ep3_Visualizing_Telemetry.ipynb" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--glass-border); padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Speed Traces Notebook (.ipynb)
  </a>
  <a href="https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/dyp4q8pcdt_0_to_Hero_Ep4_Tire_Degradation.ipynb" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--glass-border); padding: 12px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">
    ⬇️ Tire Degradation Notebook (.ipynb)
  </a>
</div>
`
};

async function executeMerge() {
  console.log('Merging lab download sections into comprehensive articles...');
  for (const [articleId, attachment] of Object.entries(LAB_ATTACHMENTS)) {
    const { data: art } = await supabase.from('articles').select('title, content').eq('id', articleId).single();
    if (art) {
      if (!art.content.includes('Hands-On Cisco Packet Tracer Lab Files') && !art.content.includes('Hands-On Python & Jupyter Notebook Telemetry Labs')) {
        const updatedContent = art.content + attachment;
        const { error } = await supabase.from('articles').update({ content: updatedContent }).eq('id', articleId);
        if (error) console.error('Error updating', art.title, error);
        else console.log('Successfully attached lab downloads to:', art.title);
      } else {
        console.log('Already attached to:', art.title);
      }
    }
  }

  console.log('\nArchiving standalone 40-word thin lab posts...');
  const { error: archiveError } = await supabase
    .from('articles')
    .update({ status: 'archived' })
    .eq('is_lab', true);

  if (archiveError) console.error('Error archiving thin labs:', archiveError);
  else console.log('Successfully archived all thin lab posts so they no longer appear as thin URLs.');
}

executeMerge();
