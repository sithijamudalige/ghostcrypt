"use client";

import React, { useEffect, useState } from "react";
import { getBaseLikes, getBaseViews, getStoredLikes, getStoredViews } from "@/lib/articleMetrics";

interface ArticleMetricsBadgeProps {
  articleId: string;
  createdAt?: string;
  variant?: 'inline' | 'compact' | 'card';
}

export default function ArticleMetricsBadge({ articleId, createdAt, variant = 'compact' }: ArticleMetricsBadgeProps) {
  const baseLikes = getBaseLikes(articleId, createdAt);
  const baseViews = getBaseViews(articleId, createdAt);

  const [likes, setLikes] = useState(baseLikes);
  const [views, setViews] = useState(baseViews);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const storedL = getStoredLikes(articleId, baseLikes);
    setLikes(storedL.count);
    setIsLiked(storedL.isLiked);
    setViews(getStoredViews(articleId, baseViews));
  }, [articleId, baseLikes, baseViews]);

  if (variant === 'inline') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          👁️ {views.toLocaleString()} views
        </span>
        <span>&bull;</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: isLiked ? '#ff4d6d' : 'inherit' }}>
          {isLiked ? '❤️' : '🤍'} {likes.toLocaleString()} likes
        </span>
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', fontSize: '0.75rem', color: '#94a3b8' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        <span>👁️</span>
        <span>{views.toLocaleString()}</span>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: isLiked ? '#ff4d6d' : '#94a3b8' }}>
        <span>{isLiked ? '❤️' : '🤍'}</span>
        <span>{likes.toLocaleString()}</span>
      </span>
    </div>
  );
}
