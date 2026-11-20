// Utility to calculate and manage realistic views and likes for articles

function getNumericHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getBaseViews(id: string, createdAt?: string): number {
  const hash = getNumericHash(id || 'default');
  const daysOld = createdAt ? Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))) : 7;
  // Dynamic views scaling with days active
  const base = 140 + (hash % 380);
  const timeBonus = Math.min(daysOld * 12, 350);
  return base + timeBonus;
}

export function getBaseLikes(id: string, createdAt?: string): number {
  const views = getBaseViews(id, createdAt);
  // Realistic like ratio ~ 7% to 12%
  const hash = getNumericHash((id || '') + '_likes');
  const ratio = 0.07 + ((hash % 50) / 1000);
  return Math.max(8, Math.round(views * ratio));
}

export function getStoredLikes(id: string, baseLikes: number): { count: number; isLiked: boolean } {
  if (typeof window === 'undefined') return { count: baseLikes, isLiked: false };
  try {
    const isLiked = localStorage.getItem(`netcad_liked_${id}`) === 'true';
    const delta = parseInt(localStorage.getItem(`netcad_likes_delta_${id}`) || '0', 10);
    return { count: baseLikes + delta, isLiked };
  } catch {
    return { count: baseLikes, isLiked: false };
  }
}

export function toggleStoredLike(id: string, baseLikes: number): { count: number; isLiked: boolean } {
  if (typeof window === 'undefined') return { count: baseLikes, isLiked: false };
  try {
    const currentlyLiked = localStorage.getItem(`netcad_liked_${id}`) === 'true';
    const newLiked = !currentlyLiked;
    const delta = newLiked ? 1 : 0;
    localStorage.setItem(`netcad_liked_${id}`, newLiked ? 'true' : 'false');
    localStorage.setItem(`netcad_likes_delta_${id}`, delta.toString());
    return { count: baseLikes + delta, isLiked: newLiked };
  } catch {
    return { count: baseLikes, isLiked: false };
  }
}

export function getStoredViews(id: string, baseViews: number): number {
  if (typeof window === 'undefined') return baseViews;
  try {
    const visits = parseInt(localStorage.getItem(`netcad_views_${id}`) || '0', 10);
    return baseViews + visits;
  } catch {
    return baseViews;
  }
}

export function incrementStoredViews(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `netcad_viewed_session_${id}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, 'true');
      const cur = parseInt(localStorage.getItem(`netcad_views_${id}`) || '0', 10);
      localStorage.setItem(`netcad_views_${id}`, (cur + 1).toString());
    }
  } catch {
    // Ignore storage errors
  }
}
