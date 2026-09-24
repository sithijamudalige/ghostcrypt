import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "NETCAD - Tech & Cybersecurity Portal",
  description: "Community-driven tech insights, cybersecurity tools, and interactive learning.",
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
        <nav className="navbar">
          <Link href="/" className="navbar-logo">
            <img src="/netcad-logo.jpg" alt="NETCAD Logo" style={{ height: '40px', borderRadius: '6px' }} />
            NETCAD
          </Link>
          <div className="navbar-links">
            <Link href="/">Articles</Link>
            <Link href="/labs" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Labs</Link>
            <Link href="/quizzes">Quizzes</Link>
            <Link href="/encrypt">GhostCrypt</Link>
            <Link href="/login" style={{ color: 'var(--accent)' }}>Dashboard</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
