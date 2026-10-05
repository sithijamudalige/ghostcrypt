import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import ClientNavbar from "@/components/ClientNavbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NETCAD - IT & Data Science Portal",
  description: "Community-driven networking insights, data science, and interactive learning.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6427210776008174" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6427210776008174"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ClientNavbar />
        <div style={{ flex: '1 0 auto' }}>
          {children}
        </div>
        <footer style={{ width: '100%', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid #1a2333', background: 'var(--bg-primary)', marginTop: 'auto' }}>
          <p>&copy; {new Date().getFullYear()} NETCAD. All rights reserved.</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About Us</Link>
            <Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</Link>
            <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </footer>
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
