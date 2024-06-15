import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchPosts, fetchComments, selectPosts, selectComments } from '../../features/posts/postsSlice';
import { RootState, useAppDispatch } from '../../store';
import PostDetails from '../PostDetails/PostDetails';
import Loader from '../Loaders/Loader';
import NoResults from '../NoResults/NoResults';
import { Post } from '../../features/posts/types';
import { setCurrentPostId, setPreviousRoute } from '../../features/navigation/navigationSlice';

const PostDetailsPage = () => {
  const { postId, subreddit } = useParams<{ postId: string; subreddit: string }>();
  const dispatch = useAppDispatch();
  const posts = useSelector(selectPosts);
  const status = useSelector((state: RootState) => state.posts.status);
  const comments = useSelector((state: RootState) => selectComments(state, postId || ''));
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(setPreviousRoute(`/r/${subreddit}`)); // Set previous route when component mounts
  }, [dispatch, subreddit]);

  useEffect(() => {
    if (!posts.length) {
      dispatch(fetchPosts());
    } else {
      const foundPost = posts.find((p) => p.id === postId) || null;
      setPost(foundPost);
      setLoading(false);
    }
  }, [dispatch, posts, postId]);

  useEffect(() => {
    if (posts.length) {
      const foundPost = posts.find((p) => p.id === postId) || null;
      setPost(foundPost);
      setLoading(false);
    }
  }, [posts, postId]);

  useEffect(() => {
    if (postId) {
      dispatch(fetchComments(postId));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (postId) {
      dispatch(setCurrentPostId(postId));
    }
  }, [dispatch, postId]);

  if (loading || status === 'loading') {
    return <Loader component={PostDetailsPage} />;
  }

  if (!post) {
    return <NoResults />;
  }

  return (
    <div>
      <PostDetails
        post={post}
        comments={comments}
      />
    </div>
  );
};

export default PostDetailsPage;
