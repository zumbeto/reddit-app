import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { NavigationState } from './types';

const initialState: NavigationState = {
  query: '',
  shouldNavigate: false,
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
  },
});

export const { setQuery, clearQuery, resetNavigation } = navigationSlice.actions;

export const selectQuery = (state: RootState) => state.navigation.query;
export const selectShouldNavigate = (state: RootState) => state.navigation.shouldNavigate;

export default navigationSlice.reducer;
