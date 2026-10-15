import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | NETCAD',
  description: 'Terms of Service and Usage Conditions for NETCAD (netcad.company).',
};

export default function TermsOfService() {
  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel legal-panel" style={{ maxWidth: '900px', margin: '4rem auto', padding: '3rem' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Terms of Service</h1>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>Last updated: October 2026</p>
        
        <section className="content-section" style={{ background: 'transparent', border: 'none', padding: 0, lineHeight: 1.8 }}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>NETCAD</strong> (the "Service", hosted at <a href="https://netcad.company" style={{ color: 'var(--accent)' }}>netcad.company</a>), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the website.
          </p>

          <h2>2. Description of Educational Services</h2>
          <p>
            NETCAD provides educational articles, networking protocol breakdowns, downloadable Cisco Packet Tracer (.pkt) practice files, data science tutorials, and interactive web tools. The content is provided for educational and informational purposes only.
          </p>

          <h2>3. Intellectual Property & Fair Use</h2>
          <p>
            All original articles, tutorials, diagrams, and code snippets created by NETCAD are protected by applicable copyright and intellectual property laws. Users may download lab materials and code for personal, academic, and non-commercial educational use.
          </p>

          <h2>4. User Conduct & Acceptable Use</h2>
          <p>
            You agree not to use NETCAD for any unlawful purpose, to distribute malicious scripts, or to attempt unauthorized access to our administrative systems or databases.
          </p>

          <h2>5. Disclaimer of Warranties & Limitation of Liability</h2>
          <p>
            The educational materials and software tools on NETCAD are provided "as is" without warranty of any kind. NETCAD and its founder (Sithija Mudalige) shall not be liable for any network downtime, data loss, or misconfigurations resulting from the application of lab exercises on production hardware.
          </p>

          <h2>6. Contact Information</h2>
          <p>
            For any questions or legal inquiries regarding these Terms of Service, please reach out via our <Link href="/contact" style={{ color: 'var(--accent)' }}>Contact Page</Link> or by emailing <a href="mailto:sithijamudalige15@gmail.com" style={{ color: 'var(--accent)' }}>sithijamudalige15@gmail.com</a>.
          </p>
        </section>
      </main>
    </>
  );
}
