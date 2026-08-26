'use client';

import { Alert, Button, Card, CardActions, CardContent } from '@mui/material';

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  onRetry: () => void;
}

function getFriendlyMessage(error: Error): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('not found')) return "The content you're looking for couldn't be found.";
  if (msg.includes('service unavailable') || msg.includes('503'))
    return 'Service is temporarily unavailable. Please try again later.';
  if (msg.includes('unauthorized') || msg.includes('401'))
    return 'You need to be logged in to view this page.';
  return 'Something went wrong. Please try again.';
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getFriendlyMessage(error)}
        </Alert>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={onRetry}>
          Try again
        </Button>
      </CardActions>
    </Card>
  );
}
