export interface Subreddit {
  id: string;
  title: string;
  description: string;
  subscribers: number;
}

export interface SubredditsState {
  items: Subreddit[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
