import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <Link to='/'>Home</Link>
      </nav>
    </header>
  );
};

export default Header;
