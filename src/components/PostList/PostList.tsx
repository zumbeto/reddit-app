import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchPosts, fetchSubredditPosts } from '../../features/posts/postsSlice';
import { RootState, useAppDispatch } from '../../store';
import PostDetails from '../PostDetails/PostDetails';
import Loader from '../Loaders/Loader';
import NoResults from '../NoResults/NoResults';
import { useParams } from 'react-router-dom';

const PostList = () => {
  const { subreddit } = useParams<{ subreddit: string }>();
  const dispatch = useAppDispatch();
  const posts = useSelector((state: RootState) => state.posts.items);
  const status = useSelector((state: RootState) => state.posts.status);

  useEffect(() => {
    if (subreddit) {
      dispatch(fetchSubredditPosts(subreddit));
    } else if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length, subreddit]);

  if (status === 'loading') {
    return <Loader component={PostList} />;
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
