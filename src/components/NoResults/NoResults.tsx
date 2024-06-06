import styles from './NoResults.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectQuery } from '../../features/navigation/navigationSlice';

const NoResults = () => {
  const query = useSelector(selectQuery);

  return (
    <div className={styles.noResults}>
      <p>No results found for "{query}".</p>
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