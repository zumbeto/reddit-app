import navigationReducer, { setQuery, setSubreddit, selectQuery, selectSubreddit } from './navigationSlice';
import { NavigationState } from './types';
import { RootState } from '../../store';

const initialState: NavigationState = {
  query: '',
  shouldNavigate: false,
  subreddit: '',
  currentPostId: null,
  previousRoute: null,
  previousSearchQuery: null,
};

describe('navigation reducer', () => {
  it('should handle initial state', () => {
    expect(navigationReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setQuery', () => {
    const actual = navigationReducer(initialState, setQuery('test query'));
    expect(actual.query).toEqual('test query');
    expect(actual.shouldNavigate).toEqual(true);
  });

  it('should handle setSubreddit', () => {
    const actual = navigationReducer(initialState, setSubreddit('reactjs'));
    expect(actual.subreddit).toEqual('reactjs');
  });
});

describe('navigation selectors', () => {
  const state: RootState = {
    navigation: {
      query: 'test query',
      shouldNavigate: true,
      subreddit: 'reactjs',
      currentPostId: null,
      previousRoute: null,
      previousSearchQuery: null,
    },
    posts: {
      items: [],
      status: 'idle',
      error: null,
      comments: {},
      voteStatus: {},
      currentView: null,
    },
    subreddits: {
      items: [],
      status: 'idle',
      error: null,
    },
  };

  it('should select the query', () => {
    expect(selectQuery(state)).toEqual('test query');
  });

  it('should select the subreddit', () => {
    expect(selectSubreddit(state)).toEqual('reactjs');
  });
});
