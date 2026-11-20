"use client";

import React, { useEffect, useState } from "react";
import { getBaseLikes, getStoredLikes, toggleStoredLike, incrementStoredViews, getBaseViews, getStoredViews } from "@/lib/articleMetrics";

interface ArticleLikeButtonProps {
  articleId: string;
  createdAt?: string;
}

export default function ArticleLikeButton({ articleId, createdAt }: ArticleLikeButtonProps) {
  const baseLikes = getBaseLikes(articleId, createdAt);
  const baseViews = getBaseViews(articleId, createdAt);

  const [likesState, setLikesState] = useState<{ count: number; isLiked: boolean }>({
    count: baseLikes,
    isLiked: false,
  });
  const [viewsCount, setViewsCount] = useState<number>(baseViews);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    incrementStoredViews(articleId);
    setViewsCount(getStoredViews(articleId, baseViews));
    setLikesState(getStoredLikes(articleId, baseLikes));
  }, [articleId, baseLikes, baseViews]);

  const handleLike = () => {
    const updated = toggleStoredLike(articleId, baseLikes);
    setLikesState(updated);
    if (updated.isLiked) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  return (
    <div style={{ margin: '3rem 0 1.5rem 0', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          onClick={handleLike}
          aria-label="Like this article"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: likesState.isLiked ? 'rgba(255, 77, 109, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            color: likesState.isLiked ? '#ff4d6d' : '#ffffff',
            border: likesState.isLiked ? '1px solid #ff4d6d' : '1px solid var(--glass-border)',
            padding: '10px 22px',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            boxShadow: likesState.isLiked ? '0 0 15px rgba(255, 77, 109, 0.4)' : 'none',
          }}
        >
          <span style={{ fontSize: '1.2rem', transform: likesState.isLiked ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
            {likesState.isLiked ? '❤️' : '🤍'}
          </span>
          <span>{likesState.isLiked ? 'Liked' : 'Like'}</span>
          <span style={{ 
            background: likesState.isLiked ? '#ff4d6d' : 'rgba(255,255,255,0.1)', 
            color: '#fff', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontSize: '0.85rem' 
          }}>
            {likesState.count}
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <span>👁️</span>
          <span>{viewsCount.toLocaleString()} total views</span>
        </div>
      </div>

      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        {showToast ? (
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>✨ Thanks for reading and supporting NETCAD!</span>
        ) : (
          <span>Found this guide helpful? Leave a like to support our free labs!</span>
        )}
      </div>
    </div>
  );
}
