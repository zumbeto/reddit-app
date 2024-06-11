import { useAppDispatch } from '../../store';
import { searchPosts } from '../../features/posts/postsSlice';
import { setQuery } from '../../features/navigation/navigationSlice';
import styles from './SearchBar.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SearchIcon from '../Icons/SearchIcon';

const SearchBar = () => {
  const localQuery = useSelector((state: RootState) => state.navigation.query);
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setQuery(localQuery));
    dispatch(searchPosts(localQuery));
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.searchBar}>
      <form
        onSubmit={handleSearch}
        className={styles.searchBar__form}
      >
        <div className={styles.searchBar__form__inputContainer}>
          <input
            type='text'
            id='search'
            value={localQuery}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            className={styles.searchBar__form__inputContainer__input}
            placeholder='Search Reddit'
          />
          <button
            type='submit'
            className={styles.searchBar__form__inputContainer__button}
            disabled={localQuery.trim() === ''}
          >
            <SearchIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
