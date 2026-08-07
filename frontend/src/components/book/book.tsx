'use client';

import { BookType } from '@/types/BookTypes';
import Image from 'next/image';
import { FC } from 'react';
import st from './book.module.scss';
import Link from 'next/link';
import { Like } from '../like/like';

export const Book: FC<BookType> = ({ olid, coversUrl, title, authors, liked }) => {
  const authorsString = authors.join(' ,');
  
  return (
    <Link href={`books/${olid}`}>
      <div className={st.Book}>
        <div className={st.ImageWrapper}>
        <Image
          src={coversUrl}
          width={'300'}
          height={'450'}
          alt={title + ' cover image'}
        />
        <Like liked={liked} olid={olid}/>
        </div>
        
        <p className={st.title}>{title}</p>
        <p className={st.author}>
          {authorsString.substring(0, authorsString.length)}
        </p>
      </div>
    </Link>
  );
};
