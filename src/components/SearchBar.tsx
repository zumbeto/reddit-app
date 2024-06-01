import { useState } from 'react';
import { useAppDispatch } from '../store';
import { searchPosts } from '../features/posts/postsSlice';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchPosts(query));
  };

  return (
    <form
      onSubmit={handleSearch}
      className={styles.searchBar}
    >
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />
      <button
        type='submit'
        className={styles.button}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
