import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing article ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('articles')
      .select('views, likes')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ views: 0, likes: 0 });
    }

    return NextResponse.json({
      views: typeof data.views === 'number' ? data.views : 0,
      likes: typeof data.likes === 'number' ? data.likes : 0,
    });
  } catch (err: any) {
    return NextResponse.json({ views: 0, likes: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action, delta } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing article ID' }, { status: 400 });
    }

    if (action === 'view') {
      // Try calling RPC increment_article_views first
      const { data: rpcData, error: rpcErr } = await supabase.rpc('increment_article_views', { article_id: id });
      
      if (!rpcErr && typeof rpcData === 'number') {
        return NextResponse.json({ success: true, views: rpcData });
      }

      // Fallback: direct update
      const { data: cur } = await supabase.from('articles').select('views').eq('id', id).single();
      const nextViews = ((cur?.views as number) || 0) + 1;
      const { error: updateErr } = await supabase.from('articles').update({ views: nextViews }).eq('id', id);

      if (!updateErr) {
        return NextResponse.json({ success: true, views: nextViews });
      }
      return NextResponse.json({ success: false, views: 0 });
    }

    if (action === 'like') {
      const change = typeof delta === 'number' ? delta : 1;

      // Try calling RPC toggle_article_like first
      const { data: rpcData, error: rpcErr } = await supabase.rpc('toggle_article_like', { article_id: id, delta: change });

      if (!rpcErr && typeof rpcData === 'number') {
        return NextResponse.json({ success: true, likes: rpcData });
      }

      // Fallback: direct update
      const { data: cur } = await supabase.from('articles').select('likes').eq('id', id).single();
      const nextLikes = Math.max(0, ((cur?.likes as number) || 0) + change);
      const { error: updateErr } = await supabase.from('articles').update({ likes: nextLikes }).eq('id', id);

      if (!updateErr) {
        return NextResponse.json({ success: true, likes: nextLikes });
      }
      return NextResponse.json({ success: false, likes: 0 });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
