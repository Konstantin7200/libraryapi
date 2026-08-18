import st from './page.module.scss';
import { SearchParams } from 'next/dist/server/request/search-params';
import { FC } from 'react';
import { Pagination } from '@/components/pagination/pagination';
import { redirect } from 'next/navigation';
import { BookToolbar } from './bookToolbar/bookToolbar';
import { BookCont } from '@/components/bookCont/bookCont';
import { getBooks, getRandomBooks } from '@/lib/books';

interface pageProps {
  searchParams: Promise<SearchParams>;
}
const page: FC<pageProps> = async ({ searchParams }) => {
  const { q, page } = await searchParams;
  const data = q ? await getBooks(q,page) : await getRandomBooks(page);
  const handleChange = async (page: number) => {
    'use server';
    redirect(
      `/books?${q ? `q=${q}&` : ''}${page ? `page=${page}` : ''}`,
    );
  };
  const handleSearch = async (q:string) => {
    'use server';
    redirect(
      `/books?${q ? `q=${q}&` : ''}page=1`,
    );
  };
  return (
    <div className={st.page}>
      <h1>Books</h1>
      <BookToolbar handleSearch={handleSearch} />
      <BookCont books={data} />
      <Pagination
        handleChange={handleChange}
        page={parseInt(page as string)}
        pageCount={10}
      ></Pagination>
    </div>
  );
};
export default page;
