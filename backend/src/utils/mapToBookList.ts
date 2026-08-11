import { bookDto } from '../books/dto/bookDto';

type ApiBook = {
  title: string;
  author_name: string[];
  cover_i: string | null;
  key: string;
};

export function mapToBookList(docs: object[]): bookDto[] {
  return docs.map((book) => {
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
      olid: key.substring('/works/'.length),
      coversUrl: coversUrl,
      liked: false,
    };
  });
}

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
