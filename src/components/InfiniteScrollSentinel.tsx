"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollSentinelProps {
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function InfiniteScrollSentinel({
  onLoadMore,
  hasMore,
}: InfiniteScrollSentinelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        onLoadMore();
        setIsLoading(false);
      }, 1000); // 1 second loading state
    }
  }, [inView, hasMore, onLoadMore, isLoading]);

  if (!hasMore && !isLoading) return null;

  return (
    <div
      ref={ref}
      className='h-10 w-full flex items-center justify-center my-4'
    >
      {isLoading && (
        <div className='w-8 h-8 border-4 border-t-brand border-border rounded-full animate-spin'></div>
      )}
    </div>
  );
}
