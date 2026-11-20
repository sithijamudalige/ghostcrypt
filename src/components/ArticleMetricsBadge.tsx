"use client";

import React, { useEffect, useState } from "react";
import { fetchRealMetrics, isArticleLikedLocally } from "@/lib/articleMetrics";

interface ArticleMetricsBadgeProps {
  articleId: string;
  createdAt?: string;
  variant?: 'inline' | 'compact' | 'card';
}

export default function ArticleMetricsBadge({ articleId, variant = 'compact' }: ArticleMetricsBadgeProps) {
  const [likes, setLikes] = useState<number>(0);
  const [views, setViews] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLiked(isArticleLikedLocally(articleId));

    fetchRealMetrics(articleId).then((data) => {
      if (isMounted) {
        setViews(data.views);
        setLikes(data.likes);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  if (variant === 'inline') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          👁️ {views} views
        </span>
        <span>&bull;</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: isLiked ? '#ff4d6d' : 'inherit' }}>
          {isLiked ? '❤️' : '🤍'} {likes} likes
        </span>
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', color: '#94a3b8' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        <span>👁️</span>
        <span>{views}</span>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: isLiked ? '#ff4d6d' : '#94a3b8' }}>
        <span>{isLiked ? '❤️' : '🤍'}</span>
        <span>{likes}</span>
      </span>
    </div>
  );
}
