import st from './page.module.scss';
import { BookCardSkeleton } from '@/components/skeleton/bookCardSkeleton';

export default function Loading() {
  return (
    <div className={st.page}>
      <h1>Likes</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
