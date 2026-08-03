import { bookDto } from '../books/dto/bookDto';
import { BooksApiPageSize } from '../constants';

const API_BASE = 'https://openlibrary.org/search.json';

async function searchBooks(page: number, title?: string, author?: string) {
  const params = new URLSearchParams();
  addParamIfNotEmpty(params, 'title', title);
  addParamIfNotEmpty(params, 'author', author);
  addParamIfNotEmpty(params, 'page', page.toString());
  addParamIfNotEmpty(params, 'limit', BooksApiPageSize.toString());
  const response = await fetch(`${API_BASE}?${params.toString()}`);
  const data: unknown = await response.json();
  const books = parseBooksFromData(data);
  return books;
}
function parseBooksFromData(data: unknown): bookDto[] {
  const badDataFormatError = new Error('Bad data format');
  if (typeof data != 'object' || data === null) throw badDataFormatError;
  if (!Object.hasOwn(data, 'docs')) throw badDataFormatError;
  const docs = (data as { docs: object[] }).docs;

  const books: bookDto[] = docs.map((book) => {
    const validatedBook = validateData(book);
    if (validatedBook === null) {
      throw Error('Bad api response');
    }
    const { title, author_name, cover_i, key } = validatedBook;
    const coversUrl = cover_i
      ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`
      : null;
    return {
      title: title,
      authors: author_name,
      olid: key,
      coversUrl: coversUrl,
    };
  });
  return books;
}

type ApiBook = {
  title: string;
  author_name: string[];
  cover_i: string | null;
  key: string;
};

function validateData(data: object): ApiBook | null {
  if (
    Object.hasOwn(data, 'title') &&
    Object.hasOwn(data, 'author_name') &&
    Object.hasOwn(data, 'key')
  ) {
    if (Object.hasOwn(data, 'cover_i')) return data as ApiBook;
    else {
      return {
        ...(data as ApiBook),
        cover_i: null,
      };
    }
  } else {
    return null;
  }
}

function addParamIfNotEmpty(
  params: URLSearchParams,
  property: string,
  value: string | undefined,
) {
  if (value != undefined && value !== '') params.append(property, value);
}

export { searchBooks };
