import st from './page.module.scss';
import { BookDetailSkeleton } from '@/components/skeleton/bookDetailSkeleton';

export default function Loading() {
  return (
    <div className={st.page}>
      <BookDetailSkeleton />
    </div>
  );
}
