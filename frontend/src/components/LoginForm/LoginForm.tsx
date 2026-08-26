'use client';

import { FC, useState } from 'react';
import st from './LoginForm.module.scss';
import { Alert, Button, CircularProgress, FormControl, TextField } from '@mui/material';

interface LoginFormProps {
  handleClick: (login: string, password: string) => Promise<{ error?: string } | void>;
  variant: 'signUp' | 'login';
}
export const LoginForm: FC<LoginFormProps> = ({ handleClick, variant }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const buttonText = variant === 'login' ? 'Login' : 'Sign up';

  const onClick = async () => {
    setError(null);
    setLoading(true);
    const result = await handleClick(login, password);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={st.LoginForm}>
      <FormControl>
        <TextField
          label="Username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          variant="contained"
          onClick={onClick}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {buttonText}
        </Button>
      </FormControl>
    </div>
  );
};
