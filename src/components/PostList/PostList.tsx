import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPosts, fetchSubredditPosts, upvote, downvote } from '../../features/posts/postsSlice';
import { RootState, useAppDispatch } from '../../store';
import { VoteStatus } from '../../features/posts/types';
import { timeAgo } from '../../utils/timeAgo';
import { formatNumbers } from '../../utils/formatNumbers';
import UpvoteArrow from '../Icons/Upvote';
import DownvoteArrow from '../Icons/Downvote';
import Comments from '../PostComments/PostComments';
import CommentsIcon from '../Icons/CommentsIcon';
import NoResults from '../NoResults/NoResults';
import styles from './PostList.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { selectQuery, selectShouldNavigate, resetNavigation } from '../../features/navigation/navigationSlice';

const PostList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { subreddit } = useParams<{ subreddit: string }>();
  const posts = useSelector((state: RootState) => state.posts.items);
  const query = useSelector(selectQuery);
  const shouldNavigate = useSelector(selectShouldNavigate);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({});
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log('Subreddit parameter:', subreddit);
    if (subreddit) {
      console.log('Fetching posts for subreddit:', subreddit);
      dispatch(fetchSubredditPosts(subreddit));
    } else {
      console.log('Fetching popular posts');
      dispatch(fetchPosts());
    }
  }, [dispatch, subreddit]);

  useEffect(() => {
    if (shouldNavigate && posts.length === 0 && query !== '') {
      navigate('/no-results', { replace: true });
      dispatch(resetNavigation());
    }
  }, [shouldNavigate, posts, query, navigate, dispatch]);

  const handleUpvote = (postId: string) => {
    if (voteStatus[postId] === 'upvoted') {
      dispatch(downvote(postId));
      setVoteStatus((prevStatus) => ({ ...prevStatus, [postId]: null }));
    } else {
      if (voteStatus[postId] === 'downvoted') {
        dispatch(upvote(postId));
      }
      dispatch(upvote(postId));
      setVoteStatus((prevStatus) => ({ ...prevStatus, [postId]: 'upvoted' }));
    }
  };

  const handleDownvote = (postId: string) => {
    if (voteStatus[postId] === 'downvoted') {
      dispatch(upvote(postId));
      setVoteStatus((prevStatus) => ({ ...prevStatus, [postId]: null }));
    } else {
      if (voteStatus[postId] === 'upvoted') {
        dispatch(downvote(postId));
      }
      dispatch(downvote(postId));
      setVoteStatus((prevStatus) => ({ ...prevStatus, [postId]: 'downvoted' }));
    }
  };

  const toggleComments = (postId: string) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  if (posts.length === 0 && query !== '') {
    return <NoResults />;
  }

  return (
    <div className={styles.container}>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => {
          const imageUrl = post.preview?.images[0]?.source?.url.replace('&amp;', '&');
          return (
            <div
              key={post.id}
              className={`${styles.post} ${visibleComments[post.id] ? styles.commentsVisible : ''}`}
            >
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
                {imageUrl && (
                  <div className={styles.post__wrapper__imageContainer}>
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className={styles.post__wrapper__imageContainer__image}
                    />
                  </div>
                )}
                <div className={styles.post__wrapper__details}>
                  <p className={styles.post__wrapper__details__author}>{post.author}</p>
                  <p className={styles.post__wrapper__details__timeAgo}>{timeAgo(post.created_utc)}</p>
                  <button onClick={() => toggleComments(post.id)}>
                    <CommentsIcon />
                    <span>{formatNumbers(post.num_comments)}</span>
                  </button>
                </div>

                <div className={styles.postComments}>{visibleComments[post.id] && <Comments postId={post.id} />}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PostList;
