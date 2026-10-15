import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | NETCAD',
  description: 'Privacy Policy and Cookie Disclosures for NETCAD (netcad.company).',
};

export default function PrivacyPolicy() {
  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel legal-panel" style={{ maxWidth: '900px', margin: '4rem auto', padding: '3rem' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>Last updated: October 2026</p>
        
        <section className="content-section" style={{ background: 'transparent', border: 'none', padding: 0, lineHeight: 1.8 }}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>NETCAD</strong> (accessible at <a href="https://netcad.company" style={{ color: 'var(--accent)' }}>https://netcad.company</a>). 
            NETCAD is an educational IT portal dedicated to computer networking architectures, Cisco Packet Tracer labs, and data science resources.
            We respect your privacy and are committed to protecting any personal information collected through our website.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect minimal information necessary to deliver quality educational resources and ensure site stability:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '1.5rem' }}>
            <li><strong>Account Information:</strong> If you register or log in, we store your email address and authentication credentials securely via Supabase.</li>
            <li><strong>Usage & Analytics Data:</strong> We collect anonymous telemetry such as device type, browser, referring URLs, and pages visited via privacy-friendly Vercel Analytics to improve our content.</li>
            <li><strong>Interactive Tools:</strong> For cryptographic tools hosted on our platform, data encryption and decryption occurs purely client-side in your browser. We never store or transmit your secret passwords.</li>
          </ul>

          <h2>3. Google AdSense & Cookie Disclosures</h2>
          <p>
            We use Google AdSense to display advertisements on our website. To comply with Google AdSense program policies, please note the following:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '1.5rem' }}>
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Ads Settings</a>.</li>
            <li>Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>www.aboutads.info</a>.</li>
          </ul>

          <h2>4. Cookies & Consent Management</h2>
          <p>
            When you first visit NETCAD, a cookie consent banner is displayed allowing you to accept or manage your preferences in accordance with GDPR, CCPA, and global privacy standards. You can change your cookie preferences at any time via your browser settings.
          </p>

          <h2>5. Third-Party Links</h2>
          <p>
            Our tutorials may contain links to external websites, documentation, or YouTube videos. We are not responsible for the privacy practices or content of third-party platforms.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have questions, feedback, or concerns regarding this Privacy Policy, please contact us:
            <br />
            <strong>Email:</strong> <a href="mailto:sithijamudalige15@gmail.com" style={{ color: 'var(--accent)' }}>sithijamudalige15@gmail.com</a>
            <br />
            <strong>Website:</strong> <a href="https://netcad.company/contact" style={{ color: 'var(--accent)' }}>https://netcad.company/contact</a>
          </p>
        </section>
      </main>
    </>
  );
}
