import { useEffect, useRef, useState } from 'react';
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
import { Link } from 'react-router-dom';
import NoResults from '../NoResults/NoResults';
import { PostDetailsProps } from '../../features/posts/types';
import { selectPreviousRoute } from '../../features/navigation/navigationSlice';
import dashjs from 'dashjs';

const PostDetails = ({ post, comments, showBackButton, onBackButtonClick, onCommentsIconClick }: PostDetailsProps) => {
  const dispatch = useAppDispatch();
  const voteStatus = useSelector((state: RootState) => state.posts.voteStatus);
  const previousRoute = useSelector(selectPreviousRoute);

  const [savedScrollPosition] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (previousRoute) {
      window.scrollTo(0, savedScrollPosition);
    }
  }, [previousRoute, savedScrollPosition]);

  useEffect(() => {
    let dashPlayer: dashjs.MediaPlayerClass | null = null;
    let observer: IntersectionObserver | null = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !videoRef.current?.paused) {
        videoRef.current?.play().catch((error) => console.warn('Visibility play() attempt failed:', error));
      } else {
        videoRef.current?.pause();
      }
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current!.currentTime = 0;
          videoRef.current?.play().catch((error) => console.warn('Intersection play() attempt failed:', error));
        } else {
          videoRef.current?.pause();
        }
      });
    };

    const setupPlayer = () => {
      if (post.media && post.media.reddit_video && videoRef.current) {
        dashPlayer = dashjs.MediaPlayer().create();
        dashPlayer.initialize(videoRef.current, post.media.reddit_video.dash_url, true);
        dashPlayer.setAutoPlay(false);

        observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
        observer.observe(videoRef.current);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        videoRef.current.muted = true;
        videoRef.current.addEventListener('canplay', () => {
          videoRef.current?.play().catch((error) => {
            console.warn('Initial play() attempt failed:', error);
          });
        });
      }
    };

    if (post.media && post.media.reddit_video) {
      setupPlayer();
    }

    return () => {
      if (dashPlayer) {
        dashPlayer.reset();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer && videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [post.media]);

  const handleUpvote = (postId: string) => {
    dispatch(upvote(postId));
  };

  const handleDownvote = (postId: string) => {
    dispatch(downvote(postId));
  };

  if (!post) {
    return <NoResults />;
  }

  const imageUrl = post.preview?.images[0]?.source?.url.replace('&amp;', '&');
  const videoUrl = post.media?.reddit_video?.dash_url;

  return (
    <div
      key={post.id}
      className={styles.post}
    >
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
      <Link
        to={`/r/${post.subreddit}/post/${post.id}`}
        className={styles.post__info}
      >
        <div className={styles.post__info__box}>
          <p className={styles.post__info__author}>{post.author}</p>
          <p className={styles.post__info__timeAgo}>
            <span>&#x2022;</span>
            {timeAgo(post.created_utc)}
          </p>
        </div>
      </Link>
      <div className={styles.post__contentWrapper}>
        <div className={styles.post__content}>
          <Link
            to={`/r/${post.subreddit}/post/${post.id}`}
            className={styles.post__content__title}
          >
            <h2>{post.title}</h2>
          </Link>
          {imageUrl && !videoUrl && (
            <Link
              to={`/r/${post.subreddit}/post/${post.id}`}
              className={styles.post__content__imageContainer}
            >
              <img
                src={imageUrl}
                alt={post.title}
                className={styles.post__content__imageContainer__image}
              />
            </Link>
          )}
          {videoUrl && (
            <div className={styles.post__content__videoContainer}>
              <video
                ref={videoRef}
                controls
                preload='auto'
                playsInline
                className={styles.dashPlayer}
              />
            </div>
          )}
          <div className={styles.post__content__details}>
            <div className={styles.post__content__votes}>
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
            <Link
              to={`/r/${post.subreddit}/post/${post.id}`}
              className={styles.post__content__details__commentsIcon}
              onClick={onCommentsIconClick}
            >
              <CommentsIcon />
              <span>{formatNumbers(post.num_comments)}</span>
            </Link>
          </div>
        </div>
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
  );
};

export default PostDetails;
