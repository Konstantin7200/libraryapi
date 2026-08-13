import { Button, TextField } from '@mui/material';
import st from './form.module.scss';
import { changeLogin } from '@/lib/user';
import { redirect } from 'next/navigation';

interface LoginChangeFormProps {
  initialLogin: string;
}

export const LoginChangeForm = ({ initialLogin }: LoginChangeFormProps) => {
  const handleSubmit = async (formData: FormData) => {
    'use server';
    await changeLogin(formData.get('login') as string);
    redirect('/profile');
  };
  return (
    <form action={handleSubmit} className={st.form}>
      <TextField
        name="login"
        label="Username"
        defaultValue={initialLogin}
        required
      />
      <Button type="submit" variant="contained">
        Change login
      </Button>
    </form>
  );
};
