import Link from 'next/link';

export const metadata = {
  title: 'About Us | NETCAD',
  description: 'Learn about NETCAD, our mission, and our team.',
};

export default function AboutPage() {
  return (
    <main className="glass-panel" style={{ maxWidth: '800px', margin: '4rem auto', padding: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>About NETCAD</h1>
      
      <div style={{ lineHeight: 1.8, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Welcome to <strong>NETCAD</strong>, your premier destination for advanced networking tutorials, hands-on Packet Tracer labs, and cybersecurity education. 
        </p>

        <h2 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>Our Mission</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Our mission is to bridge the gap between theoretical IT concepts and real-world practical application. Whether you are studying for your CCNA, exploring VLAN architectures, or looking to sharpen your cybersecurity skills with tools like GhostCrypt, NETCAD provides completely free, high-quality resources to help you succeed.
        </p>

        <h2 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>What We Offer</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>In-Depth Articles:</strong> Comprehensive breakdowns of complex networking protocols like VTP, EtherChannel, and OSPF.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Hands-On Labs:</strong> Downloadable .pkt files to test your routing and switching knowledge directly in Cisco Packet Tracer.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Interactive Tools:</strong> Secure, client-side cryptographic utilities.</li>
        </ul>

        <h2 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>Join the Community</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Technology moves fast, and we are dedicated to keeping our content up to date. If you have any questions, feedback, or want to contribute a lab to our growing library, please don't hesitate to reach out!
        </p>

        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <Link href="/contact" style={{ display: 'inline-block', background: 'var(--accent)', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
