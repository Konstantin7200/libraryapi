'use client';
import { Favorite } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import st from './like.module.scss';
import { FC, useState, useTransition } from 'react';
import { toggleLike } from '@/lib/likes';
import { useToast } from '@/components/toast/useToast';

interface LikeProps {
  liked: boolean;
  olid: string;
  position?: 'relative';
}
export const Like: FC<LikeProps> = ({ liked, olid, position }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [isPending, startTransition] = useTransition();
  const { showError } = useToast();
  const iconStyle = {
    width: '80px',
    height: '80px',
    color: isLiked ? 'red' : 'rgb(122, 123, 124)',
  };
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    const prev = isLiked;
    setIsLiked((prev) => !prev);
    startTransition(async () => {
      try {
        await toggleLike(olid);
      } catch {
        setIsLiked(prev);
        showError('Failed to update like');
      }
    });
  };
  return (
    <div
      className={
        position === 'relative' ? st.RelativeIconWrapper : st.IconWrapper
      }
      onClick={handleLikeClick}
      style={{ cursor: isPending ? 'wait' : 'pointer', opacity: isPending ? 0.6 : 1 }}
    >
      {isPending ? (
        <CircularProgress sx={{ width: '80px', height: '80px' }} />
      ) : (
        <Favorite sx={iconStyle} />
      )}
    </div>
  );
};
