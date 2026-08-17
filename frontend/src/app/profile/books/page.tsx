import { BookCont } from '@/components/bookCont/bookCont';
import { Pagination } from '@/components/pagination/pagination';
import st from './page.module.scss';
import { getMixedBooks } from '@/lib/mixed';
import { bookListOptions, bookListItemType } from '@/types/BookListTypes';
import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';
import { Button, MenuItem, TextField } from '@mui/material';
import { FC } from 'react';

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const Page: FC<PageProps> = async ({ searchParams }) => {
  const { type, liked, query, page } = await searchParams;
  const typeValue = (type as bookListItemType) ?? 'All';
  const likedValue =
    liked === 'true' ? true : liked === 'false' ? false : undefined;
  const queryValue = (query as string) ?? '';
  const currentPage = parseInt(page as string) || 1;
  const { items: books, pageCount } = await getMixedBooks(
    typeValue,
    likedValue,
    queryValue || undefined,
    currentPage,
  );

  const handleFilter = async (formData: FormData) => {
    'use server';
    const type = (formData.get('type') as string) || 'All';
    const liked = (formData.get('liked') as string) || 'All';
    const query = (formData.get('query') as string) ?? '';
    const params = new URLSearchParams({ type, page: '1' });
    if (liked !== 'All') params.set('liked', liked);
    if (query) params.set('query', query);
    redirect(`/profile/books?${params.toString()}`);
  };
  const handleChange = async (page: number) => {
    'use server';
    const params = new URLSearchParams({ type: typeValue });
    if (likedValue !== undefined) params.set('liked', String(likedValue));
    if (queryValue) params.set('query', queryValue);
    params.set('page', String(page));
    redirect(`/profile/books?${params.toString()}`);
  };

  return (
    <div className={st.page}>
      <h1>My books</h1>
      <form action={handleFilter} className={st.filters}>
        <TextField
          select
          name="type"
          label="Type"
          defaultValue={typeValue}
          sx={{ minWidth: 200 }}
        >
          {bookListOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="liked"
          label="Likes"
          defaultValue={liked ?? 'All'}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="true">Liked</MenuItem>
          <MenuItem value="false">Not liked</MenuItem>
        </TextField>
        <TextField
          name="query"
          label="Search"
          defaultValue={queryValue}
          sx={{ minWidth: 200 }}
        />
        <Button type="submit" variant="contained">
          Apply
        </Button>
      </form>
      <BookCont books={books} />
      <Pagination handleChange={handleChange} page={currentPage} pageCount={pageCount}/>
    </div>
  );
};
export default Page;
