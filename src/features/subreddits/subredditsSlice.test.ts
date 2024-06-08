import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import subredditsReducer, { fetchSubreddits } from './subredditsSlice';
import { SubredditsState, Subreddit } from './types';
import { RootState } from '../../store';

const initialState: SubredditsState = {
  items: [],
  status: 'idle',
  error: null,
};

// Mock data for tests
const mockSubreddit: Subreddit = {
  id: '1',
  title: 'Subreddit 1',
  description: 'Description 1',
  subscribers: 1000,
};

const mock = new MockAdapter(axios);

describe('subreddits reducer', () => {
  it('should handle initial state', () => {
    expect(subredditsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
});

describe('subreddits async actions', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        subreddits: subredditsReducer,
      },
    });
  });

  it('should handle fetchSubreddits pending', () => {
    store.dispatch(fetchSubreddits.pending('', undefined));
    const state = store.getState() as RootState;
    expect(state.subreddits.status).toEqual('loading');
  });

  it('should handle fetchSubreddits fulfilled', async () => {
    const subreddits = [{ data: mockSubreddit }];
    mock.onGet('https://www.reddit.com/subreddits/popular.json').reply(200, { data: { children: subreddits } });

    await store.dispatch(fetchSubreddits() as any);

    const state = store.getState() as RootState;
    expect(state.subreddits.status).toEqual('succeeded');
    expect(state.subreddits.items.length).toEqual(1);
    expect(state.subreddits.items[0].id).toEqual('1');
  });

  it('should handle fetchSubreddits rejected', async () => {
    mock.onGet('https://www.reddit.com/subreddits/popular.json').reply(500);

    await store.dispatch(fetchSubreddits() as any);

    const state = store.getState() as RootState;
    expect(state.subreddits.status).toEqual('failed');
    expect(state.subreddits.error).toBeTruthy();
  });
});
