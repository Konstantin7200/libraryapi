'use client';

import { BookType } from '@/types/BookTypes';
import { FC } from 'react';
import st from './book.module.scss';
import Link from 'next/link';
import { Like } from '../like/like';
import { Cover } from '../cover/cover';

export const Book: FC<BookType> = ({
  olid,
  coversUrl,
  title,
  authors,
  liked,
}) => {
  const authorsString = authors.join(' ,');

  return (
    <Link href={`/books/${olid}`}>
      <div className={st.Book}>
        <div className={st.ImageWrapper}>
          <Cover coversUrl={coversUrl} title={title} />
          <Like liked={liked} olid={olid} />
        </div>

        <p className={st.title}>{title}</p>
        <p className={st.author}>
          {authorsString.substring(0, authorsString.length)}
        </p>
      </div>
    </Link>
  );
};
