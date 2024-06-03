import { useSelector } from 'react-redux';
import { fetchComments } from '../../features/posts/postsSlice';
import { RootState, useAppDispatch } from '../../store';
import { CommentsProps } from '../../features/posts/types';
import { useEffect } from 'react';
import styles from './PostComments.module.scss';

const Comments = ({ postId }: CommentsProps) => {
  const dispatch = useAppDispatch();
  const comments = useSelector((state: RootState) => state.posts.comments[postId]);

  useEffect(() => {
    if (!comments) {
      dispatch(fetchComments(postId));
    }
  }, [dispatch, postId, comments]);

  if (!comments) {
    return <p className={styles.loading}>Loading comments...</p>;
  }

  return (
    <ul className={styles.postComments}>
      {comments.map((comment) => (
        <li
          key={comment.id}
          className={styles.postComment}
        >
          <p className={styles.postAuthor}>
            <strong>{comment.author}</strong> <span>{new Date(comment.created_utc * 1000).toLocaleString()}</span>
          </p>
          <p className={styles.commentBody}>{comment.body}</p>
        </li>
      ))}
    </ul>
  );
};

export default Comments;
