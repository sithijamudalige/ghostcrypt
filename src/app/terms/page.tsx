import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel legal-panel" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          &larr; Back to Home
        </Link>
        
        <h1>Terms of Service</h1>
        <p className="subtitle">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="content-section" style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '2rem' }}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using GhostCrypt (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            GhostCrypt provides a web-based client-side encryption and decryption tool using the AES-256-GCM algorithm. The Service is provided "as is" without warranties of any kind.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>
            You agree to use the Service only for lawful purposes. You are strictly prohibited from using the Service to:
          </p>
          <ul>
            <li>Encrypt or transmit illegal, harmful, or malicious content.</li>
            <li>Engage in any activity that violates any applicable local, state, national, or international law.</li>
            <li>Attempt to reverse engineer, disrupt, or compromise the integrity of the Service.</li>
          </ul>

          <h2>4. User Responsibility</h2>
          <p>
            You are entirely responsible for remembering and securing your passwords. GhostCrypt operates on a zero-knowledge basis; we do not store your passwords and <strong>cannot recover lost passwords or decrypt data on your behalf</strong>. If you lose your password, your encrypted data is permanently inaccessible.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall GhostCrypt, its developers (including Sithija Mudalige), or its affiliates be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of data, loss of profits, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>6. Modifications to the Service</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
          </p>
        </section>
      </main>
    </>
  );
}
