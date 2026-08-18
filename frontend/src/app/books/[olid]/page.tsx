import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import st from './page.module.scss';
import { getBook, getFakeBook } from '@/lib/books';
import { createComment, getCommentByOlid } from '@/lib/comments';
import { Comment } from '@/components/comment/comment';
import { Pagination } from '@/components/pagination/pagination';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { refresh } from 'next/cache';
import { isLoggedIn } from '@/lib/auth';
import { Like } from '@/components/like/like';
import { bookListItemType, bookListOptions } from '@/types/BookListTypes';
import { addToBookList } from '@/lib/bookList';
import { LikeCount } from './likeCount';
import { redirect } from 'next/navigation';
import { SearchParams } from 'next/dist/server/request/search-params';

interface PageProps {
  params: Promise<{ olid: string }>;
  searchParams: Promise<SearchParams>;
}
const Page: FC<PageProps> = async ({ params, searchParams }) => {
  const loggedIn = await isLoggedIn();
  const olid = (await params).olid;
  const { commentsPage } = await searchParams;
  const currentPage = parseInt(commentsPage as string) || 1;
  const book = await getBook(olid);
  const { items: comments, pageCount } = await getCommentByOlid(olid, currentPage);

  async function changeCommentsPage(page: number) {
    'use server';
    redirect(`/books/${olid}?commentsPage=${page}`);
  }

  async function createCommentAction(formData: FormData) {
    'use server';
    const text = formData.get('text');
    if (typeof text === 'string' && text.trim()) {
      await createComment(olid, text);
      refresh();
    }
  }
  async function addToBookListAction(formData:FormData) {
    'use server';
    const selectedOption=formData.get('booklist') as bookListItemType
    await addToBookList(olid,selectedOption)
  }

  return (
    <div className={st.page}>
      <Link href="/books" className={st.back}>
        &larr; Back to books
      </Link>
      <div className={st.layout}>
        <div className={st.cover}>
          <Image
            src={book.coversUrl}
            width={300}
            height={450}
            alt={`${book.title} cover image`}
            className={st.coverImage}
          />
        </div>
        <div className={st.details}>
          <h1 className={st.title}>{book.title}</h1>
          <p className={st.author}>{book.authors.join(' ,')}</p>
          <div className={st.LikeWrapper}>
            <LikeCount initialLikes={book.likes} olid={olid}/>
            <Like position='relative' liked={book.liked} olid={olid}/>
          </div>
          <form className={st.BookListWrapper} action={addToBookListAction}>
            <Select fullWidth name='booklist' defaultValue={bookListOptions[0]}>
              {bookListOptions.map((v)=><MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
            <Button variant='outlined' type='Submit'>Add to booklist</Button>
          </form>
        </div>
      </div>
      <h2>Description</h2>
      <p className={st.description}>{book.description}</p>
      <h2>Comments</h2>
      <div className={st.comments}>
        {loggedIn ? (
          <form action={createCommentAction} className={st.form}>
            <TextField name="text" label="Add a comment" required multiline />
            <Button type="submit" variant="outlined">
              Add comment
            </Button>
          </form>
        ) : (
          <TextField
            label="You cant write comments"
            disabled
            value='To write comments you need to login first'
            error
            ></TextField>
        )}

        {comments.length === 0 && <p>No comments here yet</p>}
        {comments.length !== 0 &&
          comments.map((comment) => (
            <Comment
              key={comment.id}
              {...comment}
            />
          ))}
      </div>
      <Pagination
        handleChange={changeCommentsPage}
        page={currentPage}
        pageCount={pageCount}
      />
    </div>
  );
};
export default Page;
