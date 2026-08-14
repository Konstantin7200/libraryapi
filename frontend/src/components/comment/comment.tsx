'use client';
import { FC, FormEvent, useState, useTransition } from 'react';
import { Button } from '@mui/material';
import { CommentType } from '@/types/CommentType';
import { deleteComment, updateComment } from './actions';
import st from './comment.module.scss';

export const Comment: FC<CommentType> = ({ text, updatedAt, login, id, mine }) => {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateComment(id, formData);
      setEditing(false);
    });
  };

  const date = new Date(updatedAt).toUTCString();

  return (
    <div className={st.comment}>
      {editing ? (
        <form onSubmit={handleSave} className={st.form}>
          <textarea name="text" defaultValue={text} required className={st.editField} />
          <div className={st.actions}>
            <Button type="submit" size="small" variant="contained" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" size="small" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <p className={st.text}>
            <span className={st.login}>{login}: </span>
            {text}
          </p>
        </>
      )}
      <div className={st.RowCont}>
        <p className={st.date}>{date}</p>
        {mine && !editing && (
          <div className={st.actions}>
            <Button size="small" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => deleteComment(id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};