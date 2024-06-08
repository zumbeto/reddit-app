import styles from './NoResults.module.scss';
import { Link } from 'react-router-dom';

const NoResults = () => {
  return (
    <div className={styles.noResults}>
      <p>No results found.</p>
      <Link
        to='/'
        className={styles.backBtn}
      >
        Go Back
      </Link>
    </div>
  );
};

export default NoResults;
