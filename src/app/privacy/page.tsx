import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel legal-panel" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1>Privacy Policy</h1>
        <p className="subtitle">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="content-section" style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '2rem' }}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to GhostCrypt. Your privacy is critically important to us. This Privacy Policy outlines the types of information we collect, how it is used, and the steps we take to protect your personal information.
          </p>

          <h2>2. Data Collection and Usage</h2>
          <p>
            GhostCrypt is designed to be a zero-knowledge encryption utility. The core encryption and decryption processes occur <strong>entirely on your device (client-side)</strong> using the Web Crypto API.
          </p>
          <ul>
            <li><strong>Passwords:</strong> Your secret passwords are NEVER transmitted to our servers, logged, or stored in any database. We have absolutely no access to your passwords.</li>
            <li><strong>Encrypted Payloads:</strong> For IT security, auditing, and compliance purposes, we log the final <em>encrypted</em> payload (the scrambled text) along with a timestamp. Because we do not have your password, it is mathematically impossible for us to decrypt or read your messages.</li>
          </ul>

          <h2>3. Cookies and Tracking</h2>
          <p>
            We use Google AdSense to display advertisements on our site. Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Ads Settings</a>.
          </p>
          <p>
            If you are located in the European Economic Area (EEA), you will be presented with a Consent Management popup allowing you to manage your cookie preferences.
          </p>

          <h2>4. Data Retention</h2>
          <p>
            The encrypted payloads logged for audit purposes are retained indefinitely in our secure IT logs, but as stated, they are completely unreadable without the original password.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact the developer, Sithija Mudalige.
          </p>
        </section>
      </main>
    </>
  );
}
