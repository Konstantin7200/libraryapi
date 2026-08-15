import { Comment } from '@/components/comment/comment';
import st from './page.module.scss';
import { getMyComments } from '@/lib/comments';
import { Pagination } from '@/components/pagination/pagination';
import { redirect } from 'next/navigation';

const Page = async () => {
  const comments = await getMyComments();
  const changePage=async(page:number)=>{
    'use server';
    redirect(`comments?page=${page}`);
  }
  return (
    <div className={st.page}>
      <h1>Comments</h1>
      <div className={st.comments}>{comments.map((comment) => <Comment key={comment.id} {...comment}></Comment>)}</div>
      <Pagination page={1} pageCount={10} handleChange={changePage}/>
    </div>
  );
};
export default Page;
