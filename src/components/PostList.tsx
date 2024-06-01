import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchPosts } from '../features/posts/postsSlice';
import { RootState } from '../store';
import { useAppDispatch } from '../store';
import styles from './PostList.module.scss';

const PostList = () => {
  const dispatch = useAppDispatch();
  const posts = useSelector((state: RootState) => state.posts.items);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className={styles.postList}>
      {posts.map((post) => (
        <div
          key={post.id}
          className={styles.post}
        >
          <h2>{post.title}</h2>
          <p>{post.selftext}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
