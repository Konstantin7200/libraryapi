import { BookCont } from '@/components/bookCont/bookCont';
import st from './page.module.scss';
import { getLikedBooks } from '@/lib/likes';

const Page = async() => {
  const books=await getLikedBooks();
  return (
    <div className={st.page}>
      <h1>Likes</h1>
      <BookCont books={books} />
    </div>
  );
};
export default Page;
