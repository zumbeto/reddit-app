import { useState } from 'react';
import { useAppDispatch } from '../../store';
import { searchPosts } from '../../features/posts/postsSlice';
import { setQuery } from '../../features/navigation/navigationSlice';
import styles from './SearchBar.module.scss';
import SearchIcon from '../Icons/SearchIcon';

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const [localQuery, setLocalQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setQuery(localQuery));
    dispatch(searchPosts(localQuery));
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
            onChange={(e) => setLocalQuery(e.target.value)}
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
