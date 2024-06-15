import { Comment } from '../../features/posts/types';
import styles from './PostComments.module.scss';
import Loader from '../Loaders/Loader';

interface CommentsProps {
  postId: string;
  comments: Comment[];
}

const Comments = ({ comments }: CommentsProps) => {
  return (
    <ul className={styles.postComments}>
      {comments.length === 0 ? (
        <Loader component={Comments} />
      ) : (
        comments.map((comment) => (
          <li
            key={comment.id}
            className={styles.postComment}
          >
            <p className={styles.postAuthor}>
              <strong>{comment.author}</strong> <span>{new Date(comment.created_utc * 1000).toLocaleString()}</span>
            </p>
            <p className={styles.commentBody}>{comment.body}</p>
          </li>
        ))
      )}
    </ul>
  );
};

export default Comments;
