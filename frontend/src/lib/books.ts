import { BookType, ExtendedBookType } from '@/types/BookTypes';
import { EnvConfig } from '@/constants';

type SearchParam = string | string[] | undefined;

interface GetBooksParams {
  title?: SearchParam;
  author?: SearchParam;
  page?: SearchParam;
}

export async function getBooks(
  params: GetBooksParams = {},
): Promise<BookType[]> {
  const query = new URLSearchParams();
  if (params.title) query.set('title', String(params.title));
  if (params.author) query.set('author', String(params.author));
  if (params.page) query.set('page', String(params.page));

  const response = await fetch(
    `${EnvConfig.API_BASE}/books?${query.toString()}`,
  );
  return (await response.json()) as BookType[];
}

export async function getBook(olid: string): Promise<ExtendedBookType> {
  const response = await fetch(`${EnvConfig.API_BASE}/books/${olid}`);
  return (await response.json()) as ExtendedBookType;
}
