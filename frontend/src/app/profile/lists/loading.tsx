import st from './page.module.scss';
import { BookCardSkeleton } from '@/components/skeleton/bookCardSkeleton';
import { Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <div className={st.page}>
      <h1>Lists</h1>
      <div className={st.BookListWrapper}>
        <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height={36} width={120} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
