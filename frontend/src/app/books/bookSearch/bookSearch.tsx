'use client';
import { SearchOutlined } from '@mui/icons-material';
import { Input, InputAdornment, InputLabel } from '@mui/material';
import { FC } from 'react';

interface BookSearchProps {
  title: string;
  value: string;
  setValue: (val: string) => void;
}
export const BookSearch: FC<BookSearchProps> = ({ title, value, setValue }) => {
  return (
    <div>
      <InputLabel htmlFor={`${title}-input`}>{title}</InputLabel>
      <Input
        id={`${title}-input`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <SearchOutlined />
          </InputAdornment>
        }
      />
    </div>
  );
};
