import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './PostDetail.module.scss';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  return (
    <div className={styles.postDetail}>
      <h1>Post Detail for {postId}</h1>
      {/* Details will be fetched based on postId */}
    </div>
  );
};

export default PostDetail;
