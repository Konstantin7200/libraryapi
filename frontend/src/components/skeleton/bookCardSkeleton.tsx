import { FC } from 'react';
import { Skeleton } from '@mui/material';
import st from './skeleton.module.scss';

export const BookCardSkeleton: FC = () => {
  return (
    <div className={st.bookCardSkeleton}>
      <Skeleton variant="rectangular" className={st.cover} />
      <Skeleton variant="text" className={st.title} />
      <Skeleton variant="text" className={st.author} />
    </div>
  );
};
