import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchPosts,
  fetchSubredditPosts,
  searchPosts,
  setCurrentView,
  resetStatus,
} from '../../features/posts/postsSlice';
import { RootState, useAppDispatch } from '../../store';
import PostDetails from '../PostDetails/PostDetails';
import Loader from '../Loaders/Loader';
import NoResults from '../NoResults/NoResults';
import { useParams } from 'react-router-dom';

const PostList = () => {
  const { subreddit, query } = useParams<{ subreddit?: string; query?: string }>();
  const dispatch = useAppDispatch();
  const posts = useSelector((state: RootState) => state.posts.items);
  const status = useSelector((state: RootState) => state.posts.status);
  const error = useSelector((state: RootState) => state.posts.error);
  const currentView = useSelector((state: RootState) => state.posts.currentView);

  useEffect(() => {
    if (!query && !subreddit && currentView === 'popular' && posts.length === 0) {
      dispatch(fetchPosts());
    } else if (!query && !subreddit && currentView !== 'popular') {
      dispatch(resetStatus());
      dispatch(setCurrentView('popular'));
    } else if (query && currentView == `search-${query}`) {
      dispatch(resetStatus());
      dispatch(setCurrentView(`search-${query}`));
      dispatch(searchPosts(query));
    } else if (subreddit && currentView !== `subreddit-${subreddit}`) {
      dispatch(resetStatus());
      dispatch(setCurrentView(`subreddit-${subreddit}`));
      dispatch(fetchSubredditPosts(subreddit));
    }
  }, [dispatch, currentView, query, subreddit]);

  if (status === 'loading') {
    return <Loader component={PostList} />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (posts.length === 0 && status === 'succeeded') {
    return <NoResults />;
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <PostDetails post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
