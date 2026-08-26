import st from './page.module.scss';
import { CommentSkeleton } from '@/components/skeleton/commentSkeleton';

export default function Loading() {
  return (
    <div className={st.page}>
      <h1>Comments</h1>
      <div className={st.comments}>
        {Array.from({ length: 4 }).map((_, i) => (
          <CommentSkeleton key={i} withTitle />
        ))}
      </div>
    </div>
  );
}
