"use client";

import React, { useEffect, useState } from "react";
import { fetchRealMetrics, recordRealView, toggleRealLike, isArticleLikedLocally } from "@/lib/articleMetrics";

interface ArticleLikeButtonProps {
  articleId: string;
}

export default function ArticleLikeButton({ articleId }: ArticleLikeButtonProps) {
  const [likes, setLikes] = useState<number>(0);
  const [views, setViews] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLiked(isArticleLikedLocally(articleId));

    // Fetch current real metrics
    fetchRealMetrics(articleId).then((data) => {
      if (isMounted) {
        setViews(data.views);
        setLikes(data.likes);
      }
    });

    // Record real view once per visitor session
    recordRealView(articleId).then((newViews) => {
      if (isMounted && typeof newViews === 'number') {
        setViews(newViews);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const handleLike = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    const prevLiked = isLiked;
    const prevLikes = likes;

    // Optimistic UI update
    setIsLiked(!prevLiked);
    setLikes(prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1);

    if (!prevLiked) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }

    try {
      const result = await toggleRealLike(articleId);
      setIsLiked(result.isLiked);
      setLikes(result.likes);
    } catch {
      // Revert if failed
      setIsLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ margin: '3rem 0 1.5rem 0', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          onClick={handleLike}
          disabled={isUpdating}
          aria-label="Like this article"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: isLiked ? 'rgba(255, 77, 109, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            color: isLiked ? '#ff4d6d' : '#ffffff',
            border: isLiked ? '1px solid #ff4d6d' : '1px solid var(--glass-border)',
            padding: '10px 22px',
            borderRadius: '24px',
            cursor: isUpdating ? 'wait' : 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            boxShadow: isLiked ? '0 0 15px rgba(255, 77, 109, 0.4)' : 'none',
          }}
        >
          <span style={{ fontSize: '1.2rem', transform: isLiked ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
            {isLiked ? '❤️' : '🤍'}
          </span>
          <span>{isLiked ? 'Liked' : 'Like'}</span>
          <span style={{ 
            background: isLiked ? '#ff4d6d' : 'rgba(255,255,255,0.1)', 
            color: '#fff', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontSize: '0.85rem' 
          }}>
            {likes}
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <span>👁️</span>
          <span>{views} {views === 1 ? 'view' : 'views'}</span>
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
