import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './features/posts/postsSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
