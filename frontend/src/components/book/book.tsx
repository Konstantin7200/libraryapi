'use client';

import { BookType } from '@/types/BookTypes';
import Image from 'next/image';
import { FC } from 'react';
import st from './book.module.scss';
import { Favorite } from '@mui/icons-material';
import Link from 'next/link';
import { toggleLike } from '@/lib/likes';

export const Book: FC<BookType> = ({ olid, coversUrl, title, authors, liked }) => {
  const authorsString = authors.join(' ,');
  const iconStyle={width:"80px",height:"80px",color:liked?'red':'white'}
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    toggleLike(olid); 
  };
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
        <div className={st.IconWrapper} onClick={handleLikeClick}>
          <Favorite sx={iconStyle} />
        </div>
        </div>
        
        <p className={st.title}>{title}</p>
        <p className={st.author}>
          {authorsString.substring(0, authorsString.length)}
        </p>
      </div>
    </Link>
  );
};
