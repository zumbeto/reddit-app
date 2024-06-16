import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import RedditLogoComponent from '../Icons/RedditLogo';
import { useAppDispatch } from '../../store';
import { resetStatus, setCurrentView, fetchPosts } from '../../features/posts/postsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Header = () => {
  const error = useSelector((state: RootState) => state.posts.error);
  const status = useSelector((state: RootState) => state.posts.status);
  const currentView = useSelector((state: RootState) => state.posts.currentView);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (currentView !== 'popular') {
      dispatch(resetStatus());
      dispatch(setCurrentView('popular'));
      dispatch(fetchPosts());
    }

    window.scrollTo(0, 0);
    if (status === 'failed') {
      return <div>Error: {error}</div>;
    }
  };

  return (
    <header className={styles.header}>
      <nav>
        <NavLink
          to='/'
          onClick={handleClick}
        >
          <RedditLogoComponent />
        </NavLink>
        <h1>RedditXplore</h1>
      </nav>
      <SearchBar />
    </header>
  );
};

export default Header;
