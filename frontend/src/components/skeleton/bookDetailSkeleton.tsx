import { FC } from 'react';
import { Skeleton } from '@mui/material';
import st from './skeleton.module.scss';
import { CommentSkeleton } from './commentSkeleton';

export const BookDetailSkeleton: FC = () => {
  return (
    <div className={st.bookDetailSkeleton}>
      <div className={st.layout}>
        <Skeleton variant="rectangular" className={st.cover} />
        <div className={st.details}>
          <Skeleton variant="text" className={st.title} />
          <Skeleton variant="text" className={st.author} />
          <Skeleton variant="rectangular" className={st.likes} />
          <Skeleton variant="rectangular" className={st.booklist} />
        </div>
      </div>
      <Skeleton variant="text" width="120px" height="32px" />
      <Skeleton variant="rectangular" className={st.description} />
      <Skeleton variant="text" width="120px" height="32px" />
      <div className={st.comments}>
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    </div>
  );
};
