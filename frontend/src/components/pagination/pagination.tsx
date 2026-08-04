'use client';
import { Pagination as MPagination } from '@mui/material';
import { FC } from 'react';

interface PaginationProps {
  handleChange: (page: number) => void;
  page: number;
  pageCount: number;
}
export const Pagination: FC<PaginationProps> = ({
  handleChange,
  page,
  pageCount,
}) => {
  return (
    <MPagination
      onChange={(e, page) => {
        handleChange(page);
      }}
      page={page}
      count={pageCount}
    />
  );
};
