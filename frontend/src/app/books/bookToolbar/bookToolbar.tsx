'use client';
import { Button } from '@mui/material';
import { BookSearch } from '../bookSearch/bookSearch';
import { FC, useState } from 'react';
import st from './bookToolbar.module.scss';

interface BookToolbarProps {
  handleSearch: (q: string) => void;
}
export const BookToolbar: FC<BookToolbarProps> = ({ handleSearch }) => {
  const [query, setQuery] = useState('');
  return (
    <div className={st.BookToolbar}>
      <div>
        <BookSearch
          id="Query search"
          value={query}
          setValue={setQuery}
        ></BookSearch>
      </div>
      <Button onClick={() => handleSearch(query)} variant="contained">
        Search
      </Button>
    </div>
  );
};
