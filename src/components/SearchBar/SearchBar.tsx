import { useState } from 'react';
import { useAppDispatch } from '../../store';
import { searchPosts } from '../../features/posts/postsSlice';
import { setQuery } from '../../features/navigation/navigationSlice';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const [localQuery, setLocalQuery] = useState('');
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim() === '') {
      alert('Please enter a search query');
      return;
    }
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
          onChange={(e) => setLocalQuery(e.target.value)}
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
