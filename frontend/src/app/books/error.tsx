'use client';

import { ErrorFallback } from '@/components/errorFallback/ErrorFallback';
import { ErrorBoundaryProps } from '@/types/ErrorBoundaryProps';

export default function BooksError({ error, unstable_retry }: ErrorBoundaryProps) {
  return <ErrorFallback error={error} onRetry={unstable_retry} />;
}
