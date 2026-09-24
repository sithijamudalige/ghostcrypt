import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | NETCAD',
  description: 'Get in touch with the NETCAD team.',
};

export default function ContactPage() {
  return (
    <main className="glass-panel" style={{ maxWidth: '800px', margin: '4rem auto', padding: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>Contact Us</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Have a question, feedback, or a business inquiry? We'd love to hear from you.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        
        <div>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Direct Support</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            For all general inquiries, technical support, or partnership opportunities, please contact us directly:
            <br /><br />
            <strong>Email:</strong> <a href="mailto:sithijamudalige15@gmail.com" style={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'none' }}>sithijamudalige15@gmail.com</a>
            <br />
            <strong>Mobile / WhatsApp:</strong> <a href="tel:0787675866" style={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'none' }}>078 767 5866</a>
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Report an Issue</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            If you found a bug in one of our Packet Tracer labs or website tools, please include the URL of the article and a brief description of the problem.
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Advertising & AdSense</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            For advertising inquiries or issues regarding the ads served on our platform, please reference our <Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link> for details on how we use third-party vendors like Google AdSense.
          </p>
        </div>

      </div>
    </main>
  );
}
