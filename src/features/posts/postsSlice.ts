import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PostsState, Comment } from './types';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
  comments: {},
  voteStatus: {},
  currentView: 'popular',
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('https://www.reddit.com/r/popular.json');
    return response.data.data.children.map((child: any) => {
      const data = child.data;
      const post = {
        id: data.id,
        title: data.title,
        author: data.author,
        created_utc: data.created_utc,
        ups: data.ups,
        downs: data.downs,
        thumbnail: data.thumbnail,
        url: data.url,
        preview: data.preview,
        num_comments: data.num_comments,
        media: data.media,
        subreddit: data.subreddit,
      };
      if (data.media && data.media.reddit_video) {
        post.media.reddit_video.dash_audio_url = data.media.reddit_video.dash_url?.replace(
          /\/DASH_[^\/]+/,
          '/DASH_audio.mp4'
        );
      }
      return post;
    });
  } catch (error) {
    return rejectWithValue((error as any).response?.data || 'Fetch posts failed');
  }
});

export const fetchSubredditPosts = createAsyncThunk(
  'posts/fetchSubredditPosts',
  async (subreddit: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://www.reddit.com/r/${subreddit}.json`);
      return response.data.data.children.map((child: any) => {
        const data = child.data;
        const post = {
          id: data.id,
          title: data.title,
          author: data.author,
          created_utc: data.created_utc,
          ups: data.ups,
          downs: data.downs,
          thumbnail: data.thumbnail,
          url: data.url,
          preview: data.preview,
          num_comments: data.num_comments,
          media: data.media,
          subreddit: data.subreddit,
        };
        if (data.media && data.media.reddit_video) {
          post.media.reddit_video.dash_audio_url = data.media.reddit_video.dash_url?.replace(
            /\/DASH_[^\/]+/,
            '/DASH_audio.mp4'
          );
        }
        return post;
      });
    } catch (error) {
      return rejectWithValue((error as any).response?.data || 'Fetch subreddit posts failed');
    }
  }
);

export const searchPosts = createAsyncThunk('posts/searchPosts', async (query: string, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://www.reddit.com/search.json?q=${query}`);
    return response.data.data.children.map((child: any) => {
      const data = child.data;
      const post = {
        id: data.id,
        title: data.title,
        author: data.author,
        created_utc: data.created_utc,
        ups: data.ups,
        downs: data.downs,
        thumbnail: data.thumbnail,
        url: data.url,
        preview: data.preview,
        num_comments: data.num_comments,
        media: data.media,
        subreddit: data.subreddit,
      };
      if (data.media && data.media.reddit_video) {
        post.media.reddit_video.dash_audio_url = data.media.reddit_video.dash_url?.replace(
          /\/DASH_[^\/]+/,
          '/DASH_audio.mp4'
        );
      }
      return post;
    });
  } catch (error) {
    return rejectWithValue((error as any).response?.data || 'Search posts failed');
  }
});

export const fetchComments = createAsyncThunk('posts/fetchComments', async (postId: string, { rejectWithValue }) => {
  try {
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
  } catch (error) {
    return rejectWithValue((error as any).response?.data || 'Fetch comments failed');
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    upvote: (state, action) => {
      const postId = action.payload;
      const post = state.items.find((post) => post.id === postId);
      if (post) {
        if (state.voteStatus[postId] === 'upvoted') {
          post.ups -= 1;
          state.voteStatus[postId] = null;
        } else {
          if (state.voteStatus[postId] === 'downvoted') {
            post.downs -= 1;
          }
          post.ups += 1;
          state.voteStatus[postId] = 'upvoted';
        }
      }
    },
    downvote: (state, action) => {
      const postId = action.payload;
      const post = state.items.find((post) => post.id === postId);
      if (post) {
        if (state.voteStatus[postId] === 'downvoted') {
          post.downs -= 1;
          state.voteStatus[postId] = null;
        } else {
          if (state.voteStatus[postId] === 'upvoted') {
            post.ups -= 1;
          }
          post.downs += 1;
          state.voteStatus[postId] = 'downvoted';
        }
      }
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    resetStatus: (state) => {
      state.status = 'idle';
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

export const selectPosts = (state: RootState) => state.posts.items;

export const selectComments = createSelector(
  [(state: RootState, postId: string) => state.posts.comments[postId]],
  (comments) => comments || []
);

export const { upvote, downvote, setCurrentView, resetStatus } = postsSlice.actions;

export default postsSlice.reducer;
