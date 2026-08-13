'use client';
import { FC, FormEvent, useState, useTransition } from 'react';
import { Button } from '@mui/material';
import { CommentType } from '@/types/CommentType';
import st from './comment.module.scss';

interface CommentProps extends CommentType {
  updateAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
}

export const Comment: FC<CommentProps> = ({
  text,
  updatedAt,
  login,
  id,
  mine,
  updateAction,
  deleteAction,
}) => {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateAction(formData);
      setEditing(false);
    });
  };

  const date =new Date(updatedAt).toUTCString();

  return (
    <div className={st.comment}>
      {editing ? (
        <form onSubmit={handleSave} className={st.form}>
          <input type="hidden" name="id" value={id} />
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
      {mine && (
        <div className={st.actions}>
          <Button onClick={() => setEditing(true)}>
            Edit
          </Button>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" color="error">
              Delete
            </Button>
          </form>
        </div>
      )}
      </div>
    </div>
  );
};