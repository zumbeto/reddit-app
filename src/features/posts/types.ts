export interface Post {
  id: string;
  title: string;
  selftext: string;
}

export interface PostsState {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
