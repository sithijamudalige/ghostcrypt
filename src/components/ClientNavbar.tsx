"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ClientNavbar() {
  const router = useRouter();
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

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <img src="/netcad-logo.jpg" alt="NETCAD Logo" style={{ height: '40px', borderRadius: '6px' }} />
        NETCAD
      </Link>
      <div className="navbar-links">
        <Link href="/">Articles</Link>
        <Link href="/labs" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Labs</Link>
        <Link href="/quizzes">Quizzes</Link>
        <Link href="/encrypt">Crypto Tool</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        
        {session ? (
          <>
            <Link href="/dashboard" style={{ color: 'var(--accent)' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', padding: 0 }}>Logout</button>
            <Link href="/dashboard" className="primary" style={{ padding: '0.4rem 1rem', width: 'auto', borderRadius: '6px', fontSize: '0.9rem', color: '#000', margin: 0, textDecoration: 'none', display: 'inline-block' }}>+ Add Article</Link>
          </>
        ) : (
          <Link href="/login" style={{ color: 'var(--accent)' }}>Login / Register</Link>
        )}
      </div>
    </nav>
  );
}
