import { BookCont } from '@/components/bookCont/bookCont';
import { Pagination } from '@/components/pagination/pagination';
import st from './page.module.scss';
import { getLikedBooks } from '@/lib/likes';
import { redirect } from 'next/navigation';
import { SearchParams } from 'next/dist/server/request/search-params';

interface PageProps {
  searchParams: Promise<SearchParams>;
}
const Page = async({searchParams}:PageProps) => {
  const {page}=await searchParams;
  const currentPage=parseInt(page as string)||1;
  const { items: books, pageCount }=await getLikedBooks(currentPage);
  const handleChange=async (page:number)=>{
    'use server';
    redirect(`/profile/likes?page=${page}`);
  }
  return (
    <div className={st.page}>
      <h1>Likes</h1>
      <BookCont books={books} />
      <Pagination handleChange={handleChange} page={currentPage} pageCount={pageCount}/>
    </div>
  );
};
export default Page;