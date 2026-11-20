"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function ClientNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isLinkActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/' || pathname.startsWith('/blog');
    }
    return pathname.startsWith(path);
  };

  const getNavLinkStyle = (path: string) => {
    const active = isLinkActive(path);
    return {
      color: active ? '#00e5ff' : 'var(--text-secondary, #94a3b8)',
      fontWeight: active ? 700 : 500,
      position: 'relative' as const,
      textDecoration: 'none',
      padding: '0.4rem 0.8rem',
      borderRadius: '8px',
      background: active ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
      border: active ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid transparent',
      textShadow: active 
        ? '0 0 10px rgba(0, 229, 255, 0.9), 0 0 20px rgba(0, 229, 255, 0.5)' 
        : 'none',
      boxShadow: active 
        ? '0 0 15px rgba(0, 229, 255, 0.25), inset 0 0 10px rgba(0, 229, 255, 0.15)' 
        : 'none',
      transition: 'all 0.25s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
    };
  };

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <img src="/netcad-logo.jpg" alt="NETCAD Logo" style={{ height: '40px', borderRadius: '6px' }} />
        NETCAD
      </Link>
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link href="/" style={getNavLinkStyle('/')}>
          Articles
        </Link>
        <Link href="/labs" style={getNavLinkStyle('/labs')}>
          <span>🧪</span> Hands-On Labs
        </Link>
        <Link href="/quizzes" style={getNavLinkStyle('/quizzes')}>
          <span>🧠</span> Quizzes
        </Link>
        <Link href="/about" style={getNavLinkStyle('/about')}>
          About
        </Link>
        <Link href="/contact" style={getNavLinkStyle('/contact')}>
          Contact
        </Link>
        
        {session ? (
          <>
            <Link href="/dashboard" style={getNavLinkStyle('/dashboard')}>
              Dashboard
            </Link>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', padding: '0.4rem 0.8rem' }}>Logout</button>
            <Link href="/dashboard" className="primary" style={{ padding: '0.4rem 1rem', width: 'auto', borderRadius: '6px', fontSize: '0.9rem', color: '#000', margin: 0, textDecoration: 'none', display: 'inline-block' }}>+ Add Article</Link>
          </>
        ) : (
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, padding: '0.4rem 0.8rem' }}>Login / Register</Link>
        )}
      </div>
    </nav>
  );
}
