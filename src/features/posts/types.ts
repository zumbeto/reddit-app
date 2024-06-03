export interface Post {
  id: string;
  title: string;
  author: string;
  created_utc: number;
  ups: number;
  downs: number;
}

export interface Comment {
  id: string;
  author: string;
  body: string;
  created_utc: number;
}

export interface PostsState {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  comments: { [postId: string]: Comment[] }; // Add comments to the state
}

export interface VoteStatus {
  [key: string]: 'upvoted' | 'downvoted' | null;
}

export interface CommentsProps {
  postId: string;
}
