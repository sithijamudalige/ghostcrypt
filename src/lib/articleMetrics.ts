// Real views and likes manager for NETCAD articles

export interface RealMetrics {
  views: number;
  likes: number;
  isLiked: boolean;
}

// Fetch real counts from the backend database
export async function fetchRealMetrics(articleId: string): Promise<{ views: number; likes: number }> {
  if (!articleId) return { views: 0, likes: 0 };
  try {
    const res = await fetch(`/api/metrics?id=${encodeURIComponent(articleId)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return {
        views: typeof data.views === 'number' ? data.views : 0,
        likes: typeof data.likes === 'number' ? data.likes : 0,
      };
    }
  } catch {
    // Network or server fallback
  }

  // Local fallback if API is unreachable
  if (typeof window !== 'undefined') {
    try {
      const localViews = parseInt(localStorage.getItem(`netcad_real_views_${articleId}`) || '0', 10);
      const localLikes = parseInt(localStorage.getItem(`netcad_real_likes_${articleId}`) || '0', 10);
      return { views: localViews, likes: localLikes };
    } catch {}
  }

  return { views: 0, likes: 0 };
}

// Record a single real view per visitor session
export async function recordRealView(articleId: string): Promise<number | null> {
  if (!articleId || typeof window === 'undefined') return null;

  try {
    const sessionKey = `netcad_session_viewed_${articleId}`;
    if (sessionStorage.getItem(sessionKey)) {
      // Already viewed in this session, do not duplicate
      return null;
    }
    sessionStorage.setItem(sessionKey, 'true');

    // Also track in local storage fallback
    const curLocal = parseInt(localStorage.getItem(`netcad_real_views_${articleId}`) || '0', 10);
    localStorage.setItem(`netcad_real_views_${articleId}`, (curLocal + 1).toString());

    const res = await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: articleId, action: 'view' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (typeof data.views === 'number') return data.views;
    }
  } catch {}

  return null;
}

// Toggle real user like (+1 or -1)
export async function toggleRealLike(articleId: string): Promise<{ likes: number; isLiked: boolean }> {
  if (!articleId || typeof window === 'undefined') return { likes: 0, isLiked: false };

  try {
    const likeKey = `netcad_liked_${articleId}`;
    const currentlyLiked = localStorage.getItem(likeKey) === 'true';
    const newLiked = !currentlyLiked;
    const delta = newLiked ? 1 : -1;

    localStorage.setItem(likeKey, newLiked ? 'true' : 'false');

    // Local fallback update
    const curLocalLikes = parseInt(localStorage.getItem(`netcad_real_likes_${articleId}`) || '0', 10);
    const updatedLocal = Math.max(0, curLocalLikes + delta);
    localStorage.setItem(`netcad_real_likes_${articleId}`, updatedLocal.toString());

    const res = await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: articleId, action: 'like', delta }),
    });

    if (res.ok) {
      const data = await res.json();
      if (typeof data.likes === 'number') {
        return { likes: data.likes, isLiked: newLiked };
      }
    }

    return { likes: updatedLocal, isLiked: newLiked };
  } catch {
    return { likes: 0, isLiked: false };
  }
}

export function isArticleLikedLocally(articleId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`netcad_liked_${articleId}`) === 'true';
  } catch {
    return false;
  }
}
