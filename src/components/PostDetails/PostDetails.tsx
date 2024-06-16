import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { upvote, downvote } from '../../features/posts/postsSlice';
import { RootState, useAppDispatch } from '../../store';
import { timeAgo } from '../../utils/timeAgo';
import { formatNumbers } from '../../utils/formatNumbers';
import UpvoteArrow from '../Icons/Upvote';
import DownvoteArrow from '../Icons/Downvote';
import PostComments from '../PostComments/PostComments';
import CommentsIcon from '../Icons/CommentsIcon';
import styles from './PostDetails.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import NoResults from '../NoResults/NoResults';
import { PostDetailsProps } from '../../features/posts/types';
import {
  setQuery,
  setSubreddit,
  resetNavigation,
  setCurrentPostId,
  selectCurrentPostId,
  setPreviousRoute,
  selectPreviousRoute,
} from '../../features/navigation/navigationSlice';

const PostDetails = ({ post, comments, showBackButton, onBackButtonClick }: PostDetailsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const voteStatus = useSelector((state: RootState) => state.posts.voteStatus);
  const currentPostId = useSelector(selectCurrentPostId);
  const previousRoute = useSelector(selectPreviousRoute);

  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  useEffect(() => {
    if (previousRoute) {
      window.scrollTo(0, savedScrollPosition);
    }
  }, [previousRoute, savedScrollPosition]);

  const handleUpvote = (postId: string) => {
    dispatch(upvote(postId));
  };

  const handleDownvote = (postId: string) => {
    dispatch(downvote(postId));
  };

  const navigateToComments = (postId: string, subreddit: string) => {
    if (currentPostId === postId) {
      dispatch(setCurrentPostId(null));
      dispatch(setPreviousRoute(null));
      navigate(`/r/${subreddit}`);
    } else {
      dispatch(setQuery(''));
      dispatch(setSubreddit(subreddit));
      dispatch(setCurrentPostId(postId));
      dispatch(setPreviousRoute(window.location.pathname));
      setSavedScrollPosition(window.scrollY || document.documentElement.scrollTop);
      navigate(`/r/${subreddit}/post/${postId}`);
      dispatch(resetNavigation());
    }
  };

  if (!post) {
    return <NoResults />;
  }

  const imageUrl = post.preview?.images[0]?.source?.url.replace('&amp;', '&');
  const videoUrl = post.media?.reddit_video?.fallback_url;

  return (
    <div className={styles.container}>
      <div
        key={post.id}
        className={styles.post}
      >
        {
          <div className={`${styles.post__backBtnWrapper} ${showBackButton ? styles.visible : ''}`}>
            <Link
              to={previousRoute || '../../'}
              relative='path'
              className={styles.post__backBtn}
              onClick={onBackButtonClick}
            >
              Back
            </Link>
          </div>
        }
        <div className={styles.post__votes}>
          <button onClick={() => handleUpvote(post.id)}>
            <UpvoteArrow status={voteStatus[post.id]} />
          </button>
          <p
            className={
              voteStatus[post.id] === 'upvoted'
                ? styles.like
                : voteStatus[post.id] === 'downvoted'
                ? styles.dislike
                : ''
            }
          >
            {formatNumbers(post.ups - post.downs)}
          </p>
          <button onClick={() => handleDownvote(post.id)}>
            <DownvoteArrow status={voteStatus[post.id]} />
          </button>
        </div>
        <div className={styles.post__wrapper}>
          <div className={styles.post__wrapper__title}>
            <h2>{post.title}</h2>
          </div>
          {imageUrl && !videoUrl && (
            <div className={styles.post__wrapper__imageContainer}>
              <img
                src={imageUrl}
                alt={post.title}
                className={styles.post__wrapper__imageContainer__image}
              />
            </div>
          )}
          {videoUrl && (
            <div className={styles.post__wrapper__videoContainer}>
              <video
                controls
                preload='auto'
              >
                <source
                  src={videoUrl}
                  type='video/mp4'
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <div className={styles.post__wrapper__details}>
            <p className={styles.post__wrapper__details__author}>{post.author}</p>
            <p className={styles.post__wrapper__details__timeAgo}>{timeAgo(post.created_utc)}</p>
            <button onClick={() => navigateToComments(post.id, post.subreddit)}>
              <CommentsIcon />
              <span>{formatNumbers(post.num_comments)}</span>
            </button>
          </div>

          {comments && (
            <div className={styles.postComments}>
              <PostComments
                postId={post.id}
                comments={comments}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
