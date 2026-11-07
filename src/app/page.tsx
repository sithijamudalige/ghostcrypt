import { supabase } from "@/lib/supabase";
import HomePageClient from "@/components/HomePageClient";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "NETCAD - IT & Data Science Portal",
  description: "Comprehensive networking guides, Cisco Packet Tracer labs, and data science tutorials.",
  openGraph: {
    title: "NETCAD - IT & Data Science Portal",
    description: "Comprehensive networking guides, Cisco Packet Tracer labs, and data science tutorials.",
    url: "https://netcad.company",
    siteName: "NETCAD",
    type: "website",
  },
};

export default async function Home() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*, profiles(full_name, email)')
    .eq('status', 'published')
    .eq('is_lab', false)
    .order('created_at', { ascending: false });

  return <HomePageClient initialArticles={articles || []} />;
}
