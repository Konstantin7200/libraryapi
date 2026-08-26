'use client';
import { FC } from 'react';
import { Pagination } from '@/components/pagination/pagination';

interface BoundedPaginationProps {
  handleChange: (page: number) => void;
  page: number;
  pageCount: number;
}
export const BoundedPagination: FC<BoundedPaginationProps> = ({
  handleChange,
  page,
  pageCount,
}) => {
  const limitedPageCount=Math.min(page+2,pageCount)
  return (
    <Pagination
      handleChange={handleChange}
      page={page}
      pageCount={limitedPageCount}
    />
  );
};
