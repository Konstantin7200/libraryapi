import { FC } from 'react';
import { CommentType } from '@/types/CommentType';
import st from './comment.module.scss';

export const Comment: FC<CommentType> = ({ text, updatedAt }) => {
    const date = updatedAt instanceof Date
        ? updatedAt.toLocaleString()
        : new Date(updatedAt).toLocaleString();
    return (
        <div className={st.comment}>
            <p className={st.text}>{text}</p>
            <p className={st.date}>{date}</p>
        </div>
    );
};