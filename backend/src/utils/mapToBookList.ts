import { BookDto } from '../books/dto/bookDto';
import { NoAuthorPlaceholder } from '../constants';
import { ApiSearchDoc } from '../api/bookApi';

export function mapToBookList(docs: ApiSearchDoc[]): BookDto[] {
  return docs.map((book) => {
    const coversUrl = book.coverId
      ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
      : null;
    return {
      title: book.title,
      authors: book.authorName?.length
        ? book.authorName
        : [NoAuthorPlaceholder],
      olid: book.key.substring('/works/'.length),
      coversUrl: coversUrl,
      liked: false,
    };
  });
}
