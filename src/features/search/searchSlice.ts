import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState } from './types';

const initialState: SearchState = {
  query: '',
  status: 'idle',
  items: [],
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearQuery(state) {
      state.query = '';
    },
  },
});

export const { setQuery, clearQuery } = searchSlice.actions;
export default searchSlice.reducer;
