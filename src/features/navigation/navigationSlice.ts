import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { NavigationState } from './types';

const initialState: NavigationState = {
  query: '',
  shouldNavigate: false,
  subreddit: '',
  currentPostId: null,
  previousRoute: null,
  previousSearchQuery: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.shouldNavigate = true;
    },
    setSubreddit(state, action: PayloadAction<string>) {
      state.subreddit = action.payload;
    },
    setCurrentPostId(state, action: PayloadAction<string | null>) {
      state.currentPostId = action.payload;
    },
    setPreviousRoute(state, action: PayloadAction<string | null>) {
      state.previousRoute = action.payload;
    },
    setPreviousSearchQuery(state, action: PayloadAction<string | null>) {
      state.previousSearchQuery = action.payload;
    },
  },
});

export const { setQuery, setSubreddit, setCurrentPostId, setPreviousRoute } = navigationSlice.actions;

export const selectQuery = (state: RootState) => state.navigation.query;
export const selectSubreddit = (state: RootState) => state.navigation.subreddit;
export const selectCurrentPostId = (state: RootState) => state.navigation.currentPostId;
export const selectPreviousRoute = (state: RootState) => state.navigation.previousRoute;
export const selectPreviousSearchQuery = (state: RootState) => state.navigation.previousSearchQuery;

export default navigationSlice.reducer;
