'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'rgba(10, 17, 40, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--glass-border)',
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
      zIndex: 9999,
      flexWrap: 'wrap',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
    }}>
      <div style={{ maxWidth: '800px', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
        <strong>We value your privacy.</strong> We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic. 
        By clicking "Accept", you consent to our use of cookies in accordance with our <Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>.
      </div>
      <button onClick={acceptCookies} style={{
        background: 'var(--accent)',
        color: '#000',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s'
      }}>
        Accept Cookies
      </button>
    </div>
  );
}
