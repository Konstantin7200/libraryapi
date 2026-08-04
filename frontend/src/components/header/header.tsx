import { AccountCircleOutlined } from '@mui/icons-material';
import Link from 'next/link';
import st from './header.module.scss';
import { AppBar, Toolbar } from '@mui/material';

export const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar variant="regular" className={st.header}>
        <Link href={'/'}>Home</Link>
        <Link href={'/books'}>Books</Link>
        <Link href={'/profile'} className={st.profile}>
          <p>Profile</p>
          <AccountCircleOutlined></AccountCircleOutlined>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
