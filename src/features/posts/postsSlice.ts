import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Post, PostsState } from './types';

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('https://www.reddit.com/r/popular.json');
  return response.data.data.children.map((child: any) => child.data as Post);
});

export const searchPosts = createAsyncThunk('posts/searchPosts', async (query: string) => {
  const response = await axios.get(`https://www.reddit.com/search.json?q=${query}`);
  return response.data.data.children.map((child: any) => child.data as Post);
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
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
      });
  },
});

export default postsSlice.reducer;
