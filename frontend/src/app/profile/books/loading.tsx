import st from './page.module.scss';
import { BookCardSkeleton } from '@/components/skeleton/bookCardSkeleton';
import { Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <div className={st.page}>
      <h1>My books</h1>
      <div className={st.filters}>
        <Skeleton variant="rectangular" height={56} width={200} />
        <Skeleton variant="rectangular" height={56} width={150} />
        <Skeleton variant="rectangular" height={56} width={200} />
        <Skeleton variant="rectangular" height={36} width={80} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
