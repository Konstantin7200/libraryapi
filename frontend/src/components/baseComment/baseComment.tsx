'use client';
import {
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Button } from '@mui/material';
import { CommentType } from '@/types/CommentType';
import { deleteComment, updateComment } from './actions';
import st from './baseComment.module.scss';
import Link from 'next/link';
import { useToast } from '@/components/toast/useToast';

type BaseCommentProps = CommentType & {
  linkText: string | null;
};
export const BaseComment: FC<BaseCommentProps> = ({
  text,
  bookOlid,
  updatedAt,
  login,
  id,
  mine,
  linkText,
}) => {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const checkOverflow = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    if (!expanded) {
      checkOverflow();
    }
  }, [expanded, checkOverflow]);

  useEffect(() => {
    const handleResize = () => {
      if (!expanded) {
        checkOverflow();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [expanded, checkOverflow]);

  const { showError } = useToast();

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateComment(id, formData);
      if (result && 'error' in result) {
        showError(result.error);
      } else {
        setEditing(false);
      }
    });
  };

  const handleDelete = async () => {
    const result = await deleteComment(id);
    if (result && 'error' in result) {
      showError(result.error);
    }
  };

  const date = new Date(updatedAt).toUTCString();

  return (
    <div className={st.comment}>
      {editing ? (
        <form onSubmit={handleSave} className={st.form}>
          <textarea
            name="text"
            defaultValue={text}
            required
            className={st.editField}
          />
          <div className={st.actions}>
            <Button
              type="submit"
              size="small"
              variant="contained"
              disabled={isPending}
            >
              {isPending ? 'Saving…' : 'Save'}
            </Button>
            <Button
              type="button"
              size="small"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className={st.RowCont}>
            <p
              ref={textRef}
              className={expanded ? st.text : `${st.text} ${st.clamped}`}
            >
              <span className={st.login}>{login}: </span>
              {text}
            </p>
            {linkText != null && (
              <Link className={st.bookLink} href={`/books/${bookOlid}`}>
                {linkText}
              </Link>
            )}
          </div>
          {overflowing && (
            <div className={st.RowCont}>
              <Button size="small" onClick={() => setExpanded((prev) => !prev)}>
                {expanded ? 'Show less' : 'Show more'}
              </Button>
            </div>
          )}
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
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
