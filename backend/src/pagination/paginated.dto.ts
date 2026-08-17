import { PageSize } from '../constants';

export interface Paginated<T> {
  items: T[];
  pageCount: number;
  total: number;
}

export type PaginationOptions = {
  skip?: number;
  take?: number;
};

export function toPaginated<T>(items: T[], total: number): Paginated<T> {
  return {
    items,
    total,
    pageCount: Math.ceil(total / PageSize),
  };
}
