import st from './page.module.scss';
import { getMyComments } from '@/lib/comments';
import { Pagination } from '@/components/pagination/pagination';
import { redirect } from 'next/navigation';
import { SearchParams } from 'next/dist/server/request/search-params';
import { CommentWithTitle } from '@/components/commentWithTitle/comment';

interface PageProps {
  searchParams: Promise<SearchParams>;
}
const Page = async ({ searchParams }: PageProps) => {
  const { page } = await searchParams;
  const currentPage = parseInt(page as string) || 1;
  const { items: comments, pageCount } = await getMyComments(currentPage);
  const changePage = async (page: number) => {
    'use server';
    redirect(`/profile/comments?page=${page}`);
  };
  return (
    <div className={st.page}>
      <h1>Comments</h1>
      <div className={st.comments}>
        {comments.map((comment) => (
          <CommentWithTitle key={comment.id} {...comment} />
        ))}
      </div>
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        handleChange={changePage}
      />
    </div>
  );
};
export default Page;
