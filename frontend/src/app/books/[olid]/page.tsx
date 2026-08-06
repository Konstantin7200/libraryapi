import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import st from './page.module.scss';
import { getBook } from '@/lib/books';

interface PageProps {
    params: Promise<{ olid: string }>;
}
const Page: FC<PageProps> = async ({ params }) => {
    const olid = (await params).olid;
    const book = await getBook(olid);
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
        </div>
    );
};
export default Page;
