'use client';

import { useActionState } from 'react';
import { Button, Alert, TextField, CircularProgress } from '@mui/material';
import st from './form.module.scss';
import { changeLogin } from '@/lib/user';
import { ApiError } from '@/lib/ApiError';
import { redirect } from 'next/navigation';
import { isNextRouterError } from 'next/dist/client/components/is-next-router-error';

type State = { error: string } | null;

interface LoginChangeFormProps {
  initialLogin: string;
}

export const LoginChangeForm = ({ initialLogin }: LoginChangeFormProps) => {
  const [state, formAction, pending] = useActionState(
    async (_prevState: State, formData: FormData): Promise<State> => {
      try {
        await changeLogin(formData.get('login') as string);
        redirect('/profile');
      } catch (e) {
        if (isNextRouterError(e)) throw e;
        if (e instanceof ApiError) return { error: e.message };
        return { error: 'Failed to change login' };
      }
      return null;
    },
    null,
  );

  return (
    <form action={formAction} className={st.form}>
      <TextField
        name="login"
        label="Username"
        defaultValue={initialLogin}
        required
      />
      {state?.error && <Alert severity="error">{state.error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        disabled={pending}
        startIcon={pending ? <CircularProgress size={16} /> : undefined}
      >
        {pending ? 'Changing...' : 'Change login'}
      </Button>
    </form>
  );
};
