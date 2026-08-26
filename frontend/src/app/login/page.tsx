import { LoginForm } from '@/components/LoginForm/LoginForm';
import st from './page.module.scss';
import { login } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/ApiError';

const Page = () => {
  const loginFunc = async (username: string, password: string) => {
    'use server';
    try {
      await login(username, password);
      redirect('/books');
    } catch (e) {
      if (e instanceof ApiError) return { error: e.message };
      return { error: 'Login failed' };
    }
  };
  return (
    <div className={st.page}>
      <div className={st.hero}>
        <h1 className={st.title}>Welcome back</h1>
        <p className={st.description}>
          Sign in to continue exploring your library, track your reads, and
          manage your lists.
        </p>
      </div>
      <div className={st.card}>
        <LoginForm variant="login" handleClick={loginFunc} />
      </div>
      <p className={st.footer}>
        New to our library? <Link href="/signup">Create an account</Link>
      </p>
    </div>
  );
};
export default Page;
