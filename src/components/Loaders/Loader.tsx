import SideBar from '../SideBar/SideBar';
import Comments from '../PostComments/PostComments';
import styles from './Loader.module.scss';

const Loader = ({ component }: { component: React.ComponentType }) => {
  return (
    <div
      className={`${styles.loader} ${component === SideBar ? styles.sidebar__loader : ''} ${
        component === Comments ? styles.comments__loader : ''
      }`}
    >
      <div className={styles.loader__inner}>
        <svg>
          <path
            d='m 12.5,20 15,0 0,0 -15,0 z'
            className={`${styles.loader__led} ${styles.loader__one}`}
          />
          <path
            d='m 32.5,20 15,0 0,0 -15,0 z'
            className={`${styles.loader__led} ${styles.loader__two}`}
          />
          <path
            d='m 52.5,20 15,0 0,0 -15,0 z'
            className={`${styles.loader__led} ${styles.loader__three}`}
          />
          <path
            d='m 72.5,20 15,0 0,0 -15,0 z'
            className={`${styles.loader__led} ${styles.loader__four}`}
          />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
