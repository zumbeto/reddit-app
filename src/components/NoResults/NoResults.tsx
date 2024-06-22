import styles from './NoResults.module.scss';
import { Link } from 'react-router-dom';

const NoResults = () => {
  return (
    <div className={styles.noResults}>
      <div className={styles.noResults__box}>
        <p>No results found.</p>
        <Link
          to='/'
          className={styles.backBtn}
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default NoResults;
