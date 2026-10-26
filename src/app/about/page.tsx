import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us & Editorial Standards | NETCAD',
  description: 'Learn about NETCAD, our founder Sithija Mudalige, our hands-on engineering lab philosophy, and our editorial standards.',
};

export default function AboutPage() {
  return (
    <main className="glass-panel" style={{ maxWidth: '850px', margin: '4rem auto', padding: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>About NETCAD</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
        Practical network engineering guides, Cisco Packet Tracer labs, and data science education.
      </p>
      
      <div style={{ lineHeight: 1.8, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
        <h2 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Our Mission</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          <strong>NETCAD</strong> (accessible at <a href="https://netcad.company" style={{ color: 'var(--accent)' }}>netcad.company</a>) was founded with a single driving mission: to bridge the gap between abstract computer networking theory and hands-on, real-world practical application.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          Too many computer science and IT students study protocols like 802.1Q trunking, Spanning Tree, OSPF, and EtherChannel on paper without ever configuring them on real CLI terminals or virtual topologies. NETCAD solves this by pairing in-depth, beginner-to-advanced architectural tutorials with completely free, pre-configured downloadable Cisco Packet Tracer (<code style={{ color: 'var(--accent)' }}>.pkt</code>) lab files and PDF configuration workbooks.
        </p>

        <h2 style={{ color: 'white', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Meet the Founder & Lead Instructor</h2>
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--accent)', marginTop: 0, marginBottom: '0.5rem' }}>Sithija Mudalige</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>Founder, Network Systems Specialist & Technical Author</p>
          <p style={{ marginBottom: '1rem' }}>
            Sithija is an IT and networking enthusiast based in Sri Lanka, focusing on enterprise routing, switching architectures, Cisco CCNA curriculum preparation, and modern Python data analytics. 
          </p>
          <p style={{ margin: 0 }}>
            Having built virtual lab environments and studied complex protocol behaviors extensively, Sithija creates and tests every tutorial and Packet Tracer file available on NETCAD to ensure they reflect true enterprise network design standards.
          </p>
        </div>

        <h2 style={{ color: 'white', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Editorial & Lab Verification Standards</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '2rem' }}>
          <li style={{ marginBottom: '0.8rem' }}>
            <strong>100% Tested Lab Topologies:</strong> Every Packet Tracer (<code style={{ color: 'var(--accent)' }}>.pkt</code>) and Jupyter Notebook (<code style={{ color: 'var(--accent)' }}>.ipynb</code>) file is physically deployed, simulated, and tested for end-to-end connectivity before it is published.
          </li>
          <li style={{ marginBottom: '0.8rem' }}>
            <strong>Authentic Technical Depth:</strong> We do not publish thin definitions or automated summaries. Our articles include ASCII network topology diagrams, genuine Cisco IOS CLI syntax, command verification outputs (<code style={{ color: '#38bdf8' }}>show ip route</code>, <code style={{ color: '#38bdf8' }}>show etherchannel summary</code>), and architectural trade-off comparisons.
          </li>
          <li style={{ marginBottom: '0.8rem' }}>
            <strong>Open & Free Education:</strong> All lab downloads, configuration PDF workbooks, and core tutorials are 100% free for students, network administrators, and certification candidates worldwide.
          </li>
        </ul>

        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Have a question about a lab, found an issue, or want to suggest a new networking protocol guide?
          </p>
          <Link href="/contact" style={{ display: 'inline-block', background: 'var(--accent)', color: '#000', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            Get in Touch with Sithija
          </Link>
        </div>
      </div>
    </main>
  );
}
