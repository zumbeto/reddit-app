import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { NavigationState } from './types';

const initialState: NavigationState = {
  query: '',
  shouldNavigate: false,
  subreddit: '',
  currentPostId: null,
  previousRoute: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.shouldNavigate = true;
    },
    clearQuery(state) {
      state.query = '';
    },
    resetNavigation(state) {
      state.shouldNavigate = false;
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
  },
});

export const { setQuery, clearQuery, resetNavigation, setSubreddit, setCurrentPostId, setPreviousRoute } =
  navigationSlice.actions;

export const selectQuery = (state: RootState) => state.navigation.query;
export const selectShouldNavigate = (state: RootState) => state.navigation.shouldNavigate;
export const selectSubreddit = (state: RootState) => state.navigation.subreddit;
export const selectCurrentPostId = (state: RootState) => state.navigation.currentPostId;
export const selectPreviousRoute = (state: RootState) => state.navigation.previousRoute;

export default navigationSlice.reducer;
