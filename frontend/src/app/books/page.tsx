import { BookType } from '@/types/BookTypes';
import st from './page.module.scss';
import { Book } from '@/components/book/book';
import { EnvConfig } from '@/constants';
import { SearchParams } from 'next/dist/server/request/search-params';
import { FC } from 'react';
import { Pagination } from '@/components/pagination/pagination';
import { redirect } from 'next/navigation';
import { BookToolbar } from './bookToolbar/bookToolbar';

interface pageProps {
  searchParams: Promise<SearchParams>;
}
const page: FC<pageProps> = async ({ searchParams }) => {
  const { title, author, page } = await searchParams;
  let data: BookType[] = [];
  if (title || author) {
    const response = await fetch(
      `${EnvConfig.API_BASE}/books?${title ? `title=${title}&` : ''}${author ? `author=${author}&` : ''}${page ? `page=${page}` : ''}`,
    );
    data = (await response.json()) as BookType[];
  }
  const handleChange = async (page: number) => {
    'use server';
    redirect(
      `/books?${title ? `title=${title}&` : ''}${author ? `author=${author}&` : ''}${page ? `page=${page}` : ''}`,
    );
  };
  const handleSearch = async(title: string, author: string) => {
    'use server';
    redirect(
      `/books?${title ? `title=${title}&` : ''}${author ? `author=${author}&` : ''}page=1`,
    );
  };
  return (
    <div className={st.page}>
      <h1>Books</h1>
      <BookToolbar handleSearch={handleSearch} />
      <div className={st.BookCont}>
        {data.map((book) => (
          <Book {...book} key={book.olid} />
        ))}
      </div>
      <Pagination
        handleChange={handleChange}
        page={parseInt(page as string)}
        pageCount={10}
      ></Pagination>
    </div>
  );
};
export default page;
