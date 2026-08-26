import { FC } from 'react';
import { Skeleton } from '@mui/material';
import st from './skeleton.module.scss';

interface CommentSkeletonProps {
  withTitle?: boolean;
}

export const CommentSkeleton: FC<CommentSkeletonProps> = ({ withTitle = false }) => {
  return (
    <div className={st.commentSkeleton}>
      <Skeleton variant="text" className={st.login} />
      {withTitle && <Skeleton variant="text" className={st.bookLink} />}
      <Skeleton variant="text" className={st.text} />
      <Skeleton variant="text" className={st.date} />
    </div>
  );
};
