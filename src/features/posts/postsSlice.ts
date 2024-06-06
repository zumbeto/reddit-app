import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Post, PostsState, Comment } from './types';

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
  comments: {},
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('https://www.reddit.com/r/popular.json');
  return response.data.data.children.map(
    (child: any) =>
      ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        created_utc: child.data.created_utc,
        ups: child.data.ups,
        downs: child.data.downs,
        thumbnail: child.data.thumbnail,
        url: child.data.url,
        preview: child.data.preview,
        num_comments: child.data.num_comments,
      } as Post)
  );
});

export const fetchSubredditPosts = createAsyncThunk('posts/fetchSubredditPosts', async (subreddit: string) => {
  const response = await axios.get(`https://www.reddit.com/r/${subreddit}.json`);
  return response.data.data.children.map(
    (child: any) =>
      ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        created_utc: child.data.created_utc,
        ups: child.data.ups,
        downs: child.data.downs,
        thumbnail: child.data.thumbnail,
        url: child.data.url,
        preview: child.data.preview,
        num_comments: child.data.num_comments,
      } as Post)
  );
});

export const searchPosts = createAsyncThunk('posts/searchPosts', async (query: string) => {
  const response = await axios.get(`https://www.reddit.com/search.json?q=${query}`);
  return response.data.data.children.map(
    (child: any) =>
      ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        created_utc: child.data.created_utc,
        ups: child.data.ups,
        downs: child.data.downs,
      } as Post)
  );
});

export const fetchComments = createAsyncThunk('posts/fetchComments', async (postId: string) => {
  const response = await axios.get(`https://www.reddit.com/comments/${postId}.json`);
  return {
    postId,
    comments: response.data[1].data.children.map(
      (child: any) =>
        ({
          id: child.data.id,
          author: child.data.author,
          body: child.data.body,
          created_utc: child.data.created_utc,
        } as Comment)
    ),
  };
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    upvote: (state, action) => {
      const post = state.items.find((post) => post.id === action.payload);
      if (post) {
        post.ups += 1;
      }
    },
    downvote: (state, action) => {
      const post = state.items.find((post) => post.id === action.payload);
      if (post) {
        post.downs += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unknown error';
      })
      .addCase(fetchSubredditPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubredditPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSubredditPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unknown error';
      })
      .addCase(searchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unknown error';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
      });
  },
});

export const { upvote, downvote } = postsSlice.actions;

export default postsSlice.reducer;
