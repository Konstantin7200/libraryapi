import { Button, Card, CardActions, CardContent } from '@mui/material';
import st from './page.module.scss';
import Link from 'next/link';
import { SearchParams } from 'next/dist/server/request/search-params';
import { getLogin } from '@/lib/user';
import { LoginChangeForm } from './loginChangeForm';
import { PasswordChangeForm } from './passwordChangeForm';

interface PageProps {
  searchParams: Promise<SearchParams>;
}
const page = async ({ searchParams }: PageProps) => {
  const { action } = await searchParams;
  const currentLogin = await getLogin();
  return (
    <div className={st.page}>
      <h1>Hello, {currentLogin}</h1>
      {action === 'change-login' && (
        <Card>
          <CardContent>
            <LoginChangeForm initialLogin={currentLogin} />
          </CardContent>
        </Card>
      )}
      {action === 'change-password' && (
        <Card>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>
      )}
      <h2>My saved</h2>
      <div>
        <Card>
          <CardContent>
            <h3>Lists</h3>
            <p>This is where your reading lists are stored</p>
          </CardContent>
          <CardActions>
            <Button variant="text">
              <Link href={'/profile/lists?type=All'}>
                View my reading lists
              </Link>
            </Button>
          </CardActions>
        </Card>
        <Card>
          <CardContent>
            <h3>Books</h3>
            <p>This is where your saved books are stored</p>
          </CardContent>
          <CardActions>
            <Button variant="text">
              <Link href={'/profile/books'}>View my books</Link>
            </Button>
          </CardActions>
        </Card>
        </div>
        <div>
          <Card>
          <CardContent>
            <h3>Comments</h3>
            <p>This is where your comments are stored</p>
          </CardContent>
          <CardActions>
            <Button variant="text">
              <Link href={'/profile/comments'}>View my comments</Link>
            </Button>
          </CardActions>
        </Card>
        <Card>
          <CardContent>
            <h3>Likes</h3>
            <p>This is where books you liked are stored</p>
          </CardContent>
          <CardActions>
            <Button variant="text">
              <Link href={'/profile/likes'}>View my likes</Link>
            </Button>
          </CardActions>
        </Card>
        </div>
      
      <hr />
      <h2>My settings</h2>
      <div>
        <Card>
          <CardContent>
            <h3>Change login</h3>
            <p>You can change your login anytime</p>
          </CardContent>
          <CardActions>
            <Button variant="text">
              <Link href={'/profile?action=change-login'}>Change login</Link>
            </Button>
          </CardActions>
        </Card>
        <Card>
          <CardContent>
            <h3>Change password</h3>
            <p>
              You can change your password anytime. You need to remember the old
              password though
            </p>
          </CardContent>
          <CardActions>
            <Button variant="text">
              <Link href={'/profile?action=change-password'}>
                Change password
              </Link>
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};
export default page;
