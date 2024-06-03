import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPosts, upvote, downvote } from '../../features/posts/postsSlice';
import { RootState, useAppDispatch } from '../../store';
import { VoteStatus } from '../../features/posts/types';
import { timeAgo } from '../../utils/timeAgo';
import { formatVotes } from '../../utils/formatVotes';
import UpvoteArrow from '../Icons/Upvote';
import DownvoteArrow from '../Icons/Downvote';
import Comments from '../PostComments/PostComments';
import CommentsIcon from '../Icons/CommentsIcon';
import NoResults from '../NoResults/NoResults';
import styles from './PostList.module.scss';
import { useNavigate } from 'react-router-dom';
import { selectQuery, selectShouldNavigate, resetNavigation } from '../../features/navigation/navigationSlice';

const PostList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state: RootState) => state.posts.items);
  const comments = useSelector((state: RootState) => state.posts.comments);
  const query = useSelector(selectQuery);
  const shouldNavigate = useSelector(selectShouldNavigate);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({});
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

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
    <div className={styles.postListWrapper}>
      {posts.map((post) => (
        <div
          key={post.id}
          className={`${styles.postList} ${visibleComments[post.id] ? styles.commentsVisible : ''}`}
        >
          <div className={styles.postVotes}>
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
              {formatVotes(post.ups - post.downs)}
            </p>
            <button onClick={() => handleDownvote(post.id)}>
              <DownvoteArrow status={voteStatus[post.id]} />
            </button>
          </div>
          <div className={styles.postWrapper}>
            <div className={styles.postTitle}>
              <h2>{post.title}</h2>
            </div>
            <div className={styles.postDetails}>
              <p className={styles.postAuthor}>{post.author}</p>
              <p className={styles.postTimeAgo}>{timeAgo(post.created_utc)}</p>
              <button onClick={() => toggleComments(post.id)}>
                <CommentsIcon />
                <span>{comments[post.id]?.length || 0}</span>
              </button>
            </div>
            <div className={styles.postComments}>{visibleComments[post.id] && <Comments postId={post.id} />}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
