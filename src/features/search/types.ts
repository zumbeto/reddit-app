import { Post } from '../posts/types';

export interface SearchState {
  query: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  items: Post[];
  error: string | null;
}
