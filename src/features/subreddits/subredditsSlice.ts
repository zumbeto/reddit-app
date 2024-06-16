import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Subreddit, SubredditsState } from '../subreddits/types';

const initialState: SubredditsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchSubreddits = createAsyncThunk('subreddits/fetchSubreddits', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('https://www.reddit.com/subreddits/popular.json');
    return response.data.data.children.map(
      (child: any) =>
        ({
          id: child.data.id,
          title: child.data.display_name,
          description: child.data.public_description,
          subscribers: child.data.subscribers,
          icon_img: child.data.icon_img,
        } as Subreddit)
    );
  } catch (error) {
    return rejectWithValue((error as any).response?.data || 'Fetch subreddits failed');
  }
});

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubreddits.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubreddits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSubreddits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default subredditsSlice.reducer;
