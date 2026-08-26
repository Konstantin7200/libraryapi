'use client';

import { useActionState } from 'react';
import { Button, Alert, TextField, CircularProgress } from '@mui/material';
import st from './form.module.scss';
import { changePassword } from '@/lib/user';
import { ApiError } from '@/lib/ApiError';
import { redirect } from 'next/navigation';
import { isNextRouterError } from 'next/dist/client/components/is-next-router-error';

type State = { error: string } | null;

export const PasswordChangeForm = () => {
  const [state, formAction, pending] = useActionState(
    async (_prevState: State, formData: FormData): Promise<State> => {
      try {
        await changePassword(
          formData.get('currentPassword') as string,
          formData.get('newPassword') as string,
        );
        redirect('/profile');
      } catch (e) {
        if (isNextRouterError(e)) throw e;
        if (e instanceof ApiError) return { error: e.message };
        return { error: 'Failed to change password' };
      }
      return null;
    },
    null,
  );

  return (
    <form action={formAction} className={st.form}>
      <TextField
        name="currentPassword"
        label="Current password"
        type="password"
        required
      />
      <TextField
        name="newPassword"
        label="New password"
        type="password"
        required
      />
      {state?.error && <Alert severity="error">{state.error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        disabled={pending}
        startIcon={pending ? <CircularProgress size={16} /> : undefined}
      >
        {pending ? 'Changing...' : 'Change password'}
      </Button>
    </form>
  );
};
