import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import RedditLogoComponent from '../Icons/RedditLogo';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <NavLink to='/'>
          <RedditLogoComponent />
        </NavLink>
        <h1>RedditXplore</h1>
      </nav>
      <SearchBar />
    </header>
  );
};

export default Header;
