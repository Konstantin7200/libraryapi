'use client';
import { Favorite } from '@mui/icons-material';
import st from './like.module.scss';
import { FC, useState, useTransition } from 'react';
import { toggleLike } from '@/lib/likes';

interface LikeProps {
  liked: boolean;
  olid: string;
  position?: 'relative';
}
export const Like: FC<LikeProps> = ({ liked, olid, position }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [, startTransition] = useTransition();
  const iconStyle = {
    width: '80px',
    height: '80px',
    color: isLiked ? 'red' : 'rgb(122, 123, 124)',
  };
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    startTransition(() => toggleLike(olid));
  };
  return (
    <div
      className={
        position === 'relative' ? st.RelativeIconWrapper : st.IconWrapper
      }
      onClick={handleLikeClick}
    >
      <Favorite sx={iconStyle} />
    </div>
  );
};
