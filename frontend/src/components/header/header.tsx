import { AccountCircleOutlined } from '@mui/icons-material';
import Link from 'next/link';
import st from './header.module.scss';
import { AppBar, Toolbar } from '@mui/material';
import { isLoggedIn } from '@/lib/auth';

export const Header = async () => {
  const loggedIn = await isLoggedIn();
  return (
    <AppBar position="sticky">
      <Toolbar variant="regular" className={st.header}>
        <Link href={'/'}>Home</Link>
        <Link href={'/books'}>Books</Link>
        {loggedIn ? (
          <Link href={'/profile'} className={st.profile}>
            <p>Profile</p>
            <AccountCircleOutlined></AccountCircleOutlined>
          </Link>
        ) : (
          <Link href={'/login'}>Login</Link>
        )}
      </Toolbar>
    </AppBar>
  );
};
