import { useAppDispatch } from '../../store';
import { searchPosts } from '../../features/posts/postsSlice';
import { setQuery } from '../../features/navigation/navigationSlice';
import styles from './SearchBar.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const SearchBar = () => {
  const localQuery = useSelector((state: RootState) => state.navigation.query);
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setQuery(localQuery));
    dispatch(searchPosts(localQuery));
  };

  return (
    <div className={styles.searchBarWrapper}>
      <form
        onSubmit={handleSearch}
        className={styles.searchBar}
      >
        <input
          type='text'
          value={localQuery}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          className={styles.input}
          placeholder='Search posts...'
        />
        <button
          type='submit'
          className={styles.button}
          disabled={localQuery.trim() === ''}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
