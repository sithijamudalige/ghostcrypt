import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Hands-On Labs & Cisco Packet Tracer Downloads | NETCAD',
  description: 'Download verified Cisco Packet Tracer (.pkt) labs, configuration PDFs, and Jupyter Notebooks for hands-on networking and telemetry practice.',
};

interface LabProject {
  title: string;
  category: 'Cisco Packet Tracer' | 'Python & Data Science';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  theoryArticleUrl: string;
  downloads: {
    label: string;
    url: string;
    type: 'pkt' | 'pdf' | 'ipynb';
  }[];
}

const LAB_PROJECTS: LabProject[] = [
  {
    title: 'Inter-VLAN Routing (IVR) Topology',
    category: 'Cisco Packet Tracer',
    difficulty: 'Intermediate',
    description: 'Build and verify Layer 3 Inter-VLAN routing across multiple departments. Practice configuring sub-interfaces on a Cisco router and 802.1Q trunking on Cisco Catalyst switches.',
    theoryArticleUrl: '/blog/4b2cb381-7a15-4e34-a203-42e92275aeb9',
    downloads: [
      {
        label: 'Download Lab (.pkt)',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/pt5swjfutvg_IVR.pkt',
        type: 'pkt',
      },
      {
        label: 'Download Config PDF Guide',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/tjro2cy2019_InterVLAN_Routing_Lab.pdf',
        type: 'pdf',
      },
    ],
  },
  {
    title: 'Router-on-a-Stick (ROAS) Configuration',
    category: 'Cisco Packet Tracer',
    difficulty: 'Intermediate',
    description: 'Learn the industry-standard ROAS design. Configure dot1Q encapsulation, assign default gateway IP addresses to virtual sub-interfaces, and verify routing between VLAN 10 and VLAN 20.',
    theoryArticleUrl: '/blog/2c7ebc7d-e0c7-46c7-9272-91250f2f247f',
    downloads: [
      {
        label: 'Download ROAS Lab (.pkt)',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/q5juka95mud_ROAS.pkt',
        type: 'pkt',
      },
      {
        label: 'Download ROAS Guide PDF',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/ik0gwvvtahq_ROAS_Lab_Guide.pdf',
        type: 'pdf',
      },
    ],
  },
  {
    title: 'EtherChannel (LACP & PAgP) Link Aggregation',
    category: 'Cisco Packet Tracer',
    difficulty: 'Advanced',
    description: 'Bundle multiple physical Ethernet links into a single logical Port-Channel. Practice IEEE 802.3ad LACP configuration and eliminate STP blocking bottlenecks on trunk uplinks.',
    theoryArticleUrl: '/blog/262a64ee-436b-4b3c-8fee-eb89bcdba307',
    downloads: [
      {
        label: 'Download EtherChannel (.pkt)',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/qfsu5y8qjf_EtherChannel%20LAB1.pkt',
        type: 'pkt',
      },
      {
        label: 'Download CCNA Lab Guide PDF',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/2cuoy7468n6_CCNA%20200-301%20EtherChannel%20Lab%20Guide.pdf',
        type: 'pdf',
      },
    ],
  },
  {
    title: 'VLAN Trunking Protocol (VTP) Synchronization',
    category: 'Cisco Packet Tracer',
    difficulty: 'Intermediate',
    description: 'Automate VLAN database propagation across enterprise campus switches. Configure VTP Server, Client, and Transparent modes, manage configuration revision numbers, and test pruning.',
    theoryArticleUrl: '/blog/bada2d68-d703-4608-b3af-1cdde1f5c2da',
    downloads: [
      {
        label: 'Download VTP Lab (.pkt)',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/hliyd8ar0g_VTP%20LAB%201.pkt',
        type: 'pkt',
      },
    ],
  },
  {
    title: 'Virtual Local Area Network (VLAN) Basics',
    category: 'Cisco Packet Tracer',
    difficulty: 'Beginner',
    description: 'Master Layer 2 broadcast domain isolation. Create standard-range VLANs, assign access switchports, configure IP addresses, and test ping connectivity between isolated segments.',
    theoryArticleUrl: '/blog/70dfc559-7caa-4d20-91cc-4aeda8b8ed49',
    downloads: [
      {
        label: 'Download VLAN Lab (.pkt)',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/b63cjxj2o8l_VLAN%20LAB%201.pkt',
        type: 'pkt',
      },
    ],
  },
  {
    title: 'Formula 1 Live Telemetry & Strategy Modeling',
    category: 'Python & Data Science',
    difficulty: 'Intermediate',
    description: 'Explore real-world data science with real Formula 1 telemetry. Analyze cornering speeds, throttle application traces, and tire degradation trends using Python and FastF1.',
    theoryArticleUrl: '/blog/63b701c7-82aa-4003-a134-627ec650261e',
    downloads: [
      {
        label: 'Telemetry Analysis (.ipynb)',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/lydespj84fj_telemetry.ipynb',
        type: 'ipynb',
      },
      {
        label: 'Speed Traces Notebook (.ipynb)',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/5tj15brz04m_0_to_Hero_Ep3_Visualizing_Telemetry.ipynb',
        type: 'ipynb',
      },
      {
        label: 'Tire Degradation Notebook (.ipynb)',
        url: 'https://tucvqsutvgwenpzyzdrc.supabase.co/storage/v1/object/public/labs/dyp4q8pcdt_0_to_Hero_Ep4_Tire_Degradation.ipynb',
        type: 'ipynb',
      },
    ],
  },
];

export default function LabsIndex() {
  return (
    <main style={{ marginTop: '2rem', marginBottom: '4rem', padding: '0 2rem', maxWidth: '1400px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Hands-On Networking & Telemetry Labs</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', margin: '0 auto', maxWidth: '800px', lineHeight: 1.6 }}>
          Practice real-world network engineering and data analysis with verified Cisco Packet Tracer (<code style={{ color: 'var(--accent)' }}>.pkt</code>) topologies, PDF CLI configuration guides, and Jupyter Notebooks.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', 
        gap: '2rem', 
        marginTop: '2rem' 
      }}>
        {LAB_PROJECTS.map((lab, index) => (
          <div key={index} className="glass-panel" style={{ 
            margin: 0, 
            maxWidth: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            padding: '2rem',
            borderLeft: '4px solid var(--accent)',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', background: 'rgba(0, 229, 255, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                  {lab.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {lab.difficulty}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', lineHeight: '1.3', marginBottom: '1rem', color: 'white' }}>
                {lab.title}
              </h2>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {lab.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.8rem' }}>
                Lab Assets & Downloads:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem' }}>
                {lab.downloads.map((dl, i) => (
                  <a 
                    key={i} 
                    href={dl.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(0,0,0,0.4)', 
                      border: '1px solid var(--glass-border)',
                      padding: '10px 14px', 
                      borderRadius: '8px', 
                      color: dl.type === 'pkt' ? 'var(--accent)' : dl.type === 'pdf' ? '#fbbf24' : '#a855f7',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <span>{dl.label}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>⬇️ Download</span>
                  </a>
                ))}
              </div>

              <Link 
                href={lab.theoryArticleUrl} 
                style={{ 
                  color: 'var(--accent)', 
                  textDecoration: 'none', 
                  fontWeight: 'bold', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.95rem'
                }}
              >
                Read In-Depth Theory & Guide &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
