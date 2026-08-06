import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import st from './page.module.scss';
import { getBook } from '@/lib/books';
import { createComment, getCommentByOlid } from '@/lib/comments';
import { Comment } from '@/components/comment/comment';
import { Button, TextField } from '@mui/material';
import { refresh } from 'next/cache';
import { isLoggedIn } from '@/lib/auth';

interface PageProps {
  params: Promise<{ olid: string }>;
}
const Page: FC<PageProps> = async ({ params }) => {
  const loggedIn = await isLoggedIn();
  const olid = (await params).olid;
  const book = await getBook(olid);
  const comments = await getCommentByOlid(olid);

  async function createCommentAction(formData: FormData) {
    'use server';
    const text = formData.get('text');
    if (typeof text === 'string' && text.trim()) {
      await createComment(olid, text);
      refresh();
    }
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
          comments.map((comment, i) => (
            <Comment
              key={i}
              text={comment.text}
              updatedAt={comment.updatedAt}
            />
          ))}
      </div>
    </div>
  );
};
export default Page;
