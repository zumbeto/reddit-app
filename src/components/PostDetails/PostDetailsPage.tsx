import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  fetchPosts,
  fetchComments,
  selectPosts,
  selectComments,
  setCurrentView,
} from '../../features/posts/postsSlice';
import { RootState, useAppDispatch } from '../../store';
import PostDetails from '../PostDetails/PostDetails';
import Loader from '../Loaders/Loader';
import NoResults from '../NoResults/NoResults';
import { Post } from '../../features/posts/types';
import {
  setCurrentPostId,
  setPreviousRoute,
  selectPreviousSearchQuery,
} from '../../features/navigation/navigationSlice';
import styles from './PostDetailsPage.module.scss';

const PostDetailsPage = () => {
  const { postId, subreddit } = useParams<{ postId: string; subreddit: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const posts = useSelector(selectPosts);
  const status = useSelector((state: RootState) => state.posts.status);
  const comments = useSelector((state: RootState) => selectComments(state, postId || ''));
  const previousSearchQuery = useSelector(selectPreviousSearchQuery);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBackButton, setShowBackButton] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    dispatch(setPreviousRoute(`/r/${subreddit}`));
    dispatch(setCurrentView(subreddit ? `subreddit-${subreddit}` : 'popular'));
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop < lastScrollTop && lastScrollTop - scrollTop > 20) {
        setShowBackButton(true);
      } else if (scrollTop > lastScrollTop || scrollTop <= 200) {
        setShowBackButton(false);
      }

      setLastScrollTop(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  const handleBackButtonClick = () => {
    dispatch(setCurrentPostId(null));
    dispatch(setPreviousRoute(null));
    if (previousSearchQuery) {
      navigate(`/search/${previousSearchQuery}`);
    } else {
      navigate(-1);
    }
  };

  if (loading || status === 'loading') {
    return <Loader component={PostDetailsPage} />;
  }

  if (!post) {
    return <NoResults />;
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <div className={styles.container}>
        <PostDetails
          post={post}
          comments={comments}
          showBackButton={showBackButton}
          onBackButtonClick={handleBackButtonClick}
          onCommentsIconClick={handleBackButtonClick}
        />
      </div>
    </div>
  );
};

export default PostDetailsPage;
