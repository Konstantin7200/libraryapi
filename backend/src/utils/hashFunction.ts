import { hash } from 'crypto';

export function hashFunction(data: string) {
  return hash('sha256', data);
}
