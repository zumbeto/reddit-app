export interface Post {
  id: string;
  title: string;
  author: string;
  created_utc: number;
  ups: number;
  downs: number;
  thumbnail: string;
  url: string;
  preview?: { images: { source: { url: string }; resolutions: { url: string; width: number; height: number }[] }[] };
  num_comments: number;
  media?: { reddit_video?: { fallback_url: string; height: number; width: number; dash_url: string } };
  subreddit: string;
}

export interface Comment {
  id: string;
  author: string;
  body: string;
  created_utc: number;
  comments: Comment[];
}

export interface PostsState {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  comments: { [postId: string]: Comment[] };
  voteStatus: { [postId: string]: 'upvoted' | 'downvoted' | null };
}

export interface VoteStatus {
  [key: string]: 'upvoted' | 'downvoted' | null;
}

export interface CommentsProps {
  postId: string;
}

export interface PostDetailsProps {
  post: Post;
  comments?: Comment[];
}
