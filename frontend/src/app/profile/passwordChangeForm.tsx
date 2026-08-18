import { Button, TextField } from '@mui/material';
import st from './form.module.scss';
import { changePassword } from '@/lib/user';
import { redirect } from 'next/navigation';

export const PasswordChangeForm = () => {
  const handleSubmit = async (formData: FormData) => {
    'use server';
    await changePassword(
      formData.get('currentPassword') as string,
      formData.get('newPassword') as string,
    );
    redirect('/profile');
  };
  return (
    <form action={handleSubmit} className={st.form}>
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
      <Button type="submit" variant="contained">
        Change password
      </Button>
    </form>
  );
};
