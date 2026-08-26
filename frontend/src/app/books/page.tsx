import st from './page.module.scss';
import { SearchParams } from 'next/dist/server/request/search-params';
import { FC } from 'react';
import { BoundedPagination } from '@/components/boundedPagination/boundedPagination';
import { redirect } from 'next/navigation';
import { BookToolbar } from './bookToolbar/bookToolbar';
import { BookCont } from '@/components/bookCont/bookCont';
import { getBooks, getRandomBooks } from '@/lib/books';

interface pageProps {
  searchParams: Promise<SearchParams>;
}
const page: FC<pageProps> = async ({ searchParams }) => {
  const params = await searchParams;
  const q=params.q;
  const page=params.page||"1";
  const data = q ? await getBooks(q, page) : await getRandomBooks(page);
  const { items: books, pageCount } = data;
  const handleChange = async (page: number) => {
    'use server';
    redirect(`/books?${q ? `q=${q}&` : ''}${page ? `page=${page}` : ''}`);
  };
  const handleSearch = async (q: string) => {
    'use server';
    redirect(`/books?${q ? `q=${q}&` : ''}page=1`);
  };
  return (
    <div className={st.page}>
      <h1>Books</h1>
      <BookToolbar handleSearch={handleSearch} />
      <BookCont books={books} />
      <BoundedPagination
        handleChange={handleChange}
        page={parseInt(page as string)}
        pageCount={pageCount}
      />
    </div>
  );
};
export default page;
