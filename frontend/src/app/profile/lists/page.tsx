import { BookCont } from '@/components/bookCont/bookCont';
import st from './page.module.scss';
import { getBookList } from '@/lib/bookList';
import { redirect } from 'next/navigation';
import { SearchParams } from 'next/dist/server/request/search-params';
import { Button, MenuItem, Select } from '@mui/material';
import { bookListItemType, bookListOptions } from '@/types/BookListTypes';
import { FC } from 'react';

interface PageProps {
  searchParams: Promise<SearchParams>;
}
const Page:FC<PageProps> = async ({searchParams}) => {
  const type=(await searchParams).type;
  const bookList=bookListOptions.find((option)=>option===type);
  if (!bookList) {
    redirect('/profile/lists?type=All');
  }
  const books = await getBookList(bookList)
  const getBooksFromListAction=async (formData:FormData)=>{
    'use server';
    const selectedBookList=formData.get('booklist') as bookListItemType
    redirect(`lists?type=${selectedBookList}`)
  }
  return (
    <div className={st.page}>
      <h1>Lists</h1>
      <form className={st.BookListWrapper} action={getBooksFromListAction}>
        <Select fullWidth name='booklist' defaultValue={bookList}>
          {bookListOptions.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
        </Select>
        <Button variant='outlined' type='Submit'>Show this list</Button>
      </form>
      <BookCont books={books} />
    </div>
  );
};

export default Page;
