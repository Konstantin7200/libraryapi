'use client';
import { Button } from '@mui/material';
import { BookSearch } from '../bookSearch/bookSearch';
import { FC, useState } from 'react';
import st from "./bookToolbar.module.scss"

interface BookToolbarProps {
  handleSearch: (title: string, author: string) => void;
}
export const BookToolbar: FC<BookToolbarProps> = ({ handleSearch }) => {
  const [author, setAuthor] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  return (
    <div className={st.BookToolbar}>
      <div>
      <BookSearch
        title="Books title"
        value={bookTitle}
        setValue={setBookTitle}
      ></BookSearch>
      <BookSearch
        title="Author"
        value={author}
        setValue={setAuthor}
      ></BookSearch>
      </div>
      <Button onClick={() => handleSearch(bookTitle, author)} variant="contained">
        Search
      </Button>
    </div>
  );
};
