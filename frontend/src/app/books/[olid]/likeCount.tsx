'use client';

import { EnvConfig } from '@/constants';
import { FC, useEffect, useState } from 'react';

interface LikeCountProps {
  initialLikes: number;
  olid: string;
}
export const LikeCount: FC<LikeCountProps> = ({ initialLikes, olid }) => {
  const [likes, setLikes] = useState(initialLikes);
  useEffect(() => {
    const eventSource = new EventSource(
      `${EnvConfig.API_BASE}/likes/sse/${olid}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as {
          bookOlid: string;
          likes: number;
        };
        setLikes(data.likes);
      } catch (error) {
        console.error('Failed to parse SSE payload', error);
      }
    };

    eventSource.onerror = () => {
      console.warn('SSE disconnected, reconnecting...', eventSource.readyState);
    };

    return () => eventSource.close();
  }, [olid]);
  return (
    <p>
      {likes} {likes % 10 === 1 ? 'Like' : 'Likes'}
    </p>
  );
};
