import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './features/posts/postsSlice';
import searchReducer from './features/search/searchSlice';
import navigationReducer from './features/navigation/navigationSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    search: searchReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
