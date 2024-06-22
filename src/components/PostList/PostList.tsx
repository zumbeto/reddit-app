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
import { useParams, Link } from 'react-router-dom';
import styles from './PostList.module.scss';

const PostList = () => {
  const { subreddit, query } = useParams<{ subreddit?: string; query?: string }>();
  const dispatch = useAppDispatch();
  const posts = useSelector((state: RootState) => state.posts.items);
  const status = useSelector((state: RootState) => state.posts.status);
  const error = useSelector((state: RootState) => state.posts.error);
  const currentView = useSelector((state: RootState) => state.posts.currentView);

  useEffect(() => {
    window.scrollTo(0, 0);

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
    <div style={{ overflow: 'hidden' }}>
      <div className={styles.container}>
        {posts.map((post) => (
          <PostDetails
            post={post}
            key={post.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
