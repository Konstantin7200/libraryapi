import { Button, Card, CardActions, CardContent } from '@mui/material';
import styles from './page.module.scss';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Welcome to the best online books library</h1>
      <h2>Here you can</h2>
      <Card>
        <CardContent>
          <h3>View books</h3>
          <p>
            Browse through our extensive collection of books across various
            genres. Discover new authors, explore different categories, and find
            your next great read.
          </p>
        </CardContent>
        <CardActions>
          <Button variant="text">
            <Link href={'/books'}>View books</Link>
          </Button>
        </CardActions>
      </Card>
      <Card>
        <CardContent>
          <h3>Like books</h3>
          <p>
            Show your appreciation for the books you love. Like your favorite
            titles and help other readers discover the most popular books in our
            community.
          </p>
        </CardContent>
        <CardActions>
          <Button variant="text">
            <Link href={'/profile/likes'}>View my likes</Link>
          </Button>
        </CardActions>
      </Card>
      <Card>
        <CardContent>
          <h3>Save them to read later</h3>
          <p>
            Create your personal reading list by saving books you want to read
            in the future. Never forget a book that caught your interest again.
          </p>
        </CardContent>
        <CardActions>
          <Button variant="text">
            <Link href={'/profile/lists'}>View my reading list</Link>
          </Button>
        </CardActions>
      </Card>
      <Card>
        <CardContent>
          <h3>Write comments</h3>
          <p>
            Share your thoughts and opinions on the books you &apos; ve read.
            Engage with other readers, discuss your favorite moments, and be
            part of our vibrant reading community.
          </p>
        </CardContent>
        <CardActions>
          <Button variant="text">
            <Link href={'/comments'}>View my comments</Link>
          </Button>
        </CardActions>
      </Card>
      <div></div>
    </div>
  );
}
