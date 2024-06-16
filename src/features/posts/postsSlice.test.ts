import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import postsReducer, {
  upvote,
  downvote,
  fetchPosts,
  fetchSubredditPosts,
  searchPosts,
  fetchComments,
} from './postsSlice';
import { PostsState, Post } from './types';
import { RootState } from '../../store';

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
  comments: {},
  voteStatus: {},
  currentView: null,
};

const mockPost: Post = {
  id: '1',
  title: 'Post 1',
  author: 'author1',
  created_utc: 1627885587,
  ups: 10,
  downs: 2,
  thumbnail: 'image.png',
  url: 'url1',
  preview: undefined,
  num_comments: 5,
  media: undefined,
  subreddit: 'popular',
};

const mock = new MockAdapter(axios);

describe('posts reducer', () => {
  it('should handle initial state', () => {
    expect(postsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle upvote', () => {
    const previousState: PostsState = {
      ...initialState,
      items: [mockPost],
    };
    const actual = postsReducer(previousState, upvote('1'));
    expect(actual.items[0].ups).toEqual(11);
  });

  it('should handle downvote', () => {
    const previousState: PostsState = {
      ...initialState,
      items: [mockPost],
    };
    const actual = postsReducer(previousState, downvote('1'));
    expect(actual.items[0].downs).toEqual(3);
  });
});

describe('posts async actions', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        posts: postsReducer,
      },
    });
  });

  it('should handle fetchPosts', async () => {
    const posts = [{ data: mockPost }];
    mock.onGet('https://www.reddit.com/r/popular.json').reply(200, { data: { children: posts } });

    await store.dispatch(fetchPosts() as any);

    const state = store.getState() as RootState;
    expect(state.posts.status).toEqual('succeeded');
    expect(state.posts.items.length).toEqual(1);
    expect(state.posts.items[0].id).toEqual('1');
  });

  it('should handle fetchSubredditPosts', async () => {
    const posts = [{ data: { ...mockPost, id: '2' } }];
    mock.onGet('https://www.reddit.com/r/subreddit.json').reply(200, { data: { children: posts } });

    await store.dispatch(fetchSubredditPosts('subreddit') as any);

    const state = store.getState() as RootState;
    expect(state.posts.status).toEqual('succeeded');
    expect(state.posts.items.length).toEqual(1);
    expect(state.posts.items[0].id).toEqual('2');
  });

  it('should handle searchPosts', async () => {
    const posts = [{ data: { ...mockPost, id: '3' } }];
    mock.onGet('https://www.reddit.com/search.json?q=query').reply(200, { data: { children: posts } });

    await store.dispatch(searchPosts('query') as any);

    const state = store.getState() as RootState;
    expect(state.posts.status).toEqual('succeeded');
    expect(state.posts.items.length).toEqual(1);
    expect(state.posts.items[0].id).toEqual('3');
  });

  it('should handle fetchComments', async () => {
    const comments = [{ data: { id: 'c1', author: 'commenter1', body: 'Nice post!', created_utc: 1627885587 } }];
    mock.onGet('https://www.reddit.com/comments/1.json').reply(200, [{}, { data: { children: comments } }]);

    await store.dispatch(fetchComments('1') as any);

    const state = store.getState() as RootState;
    expect(state.posts.comments['1'].length).toEqual(1);
    expect(state.posts.comments['1'][0].id).toEqual('c1');
  });
});
