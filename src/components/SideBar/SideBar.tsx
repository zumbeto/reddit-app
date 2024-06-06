import { NavLink } from 'react-router-dom';
import { fetchSubreddits } from '../../features/subreddits/subredditsSlice';
import { useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../store';
import styles from './SideBar.module.scss';
import fallbackImg from '../../assets/icons/no-image.png';

const SideBar = () => {
  const dispatch = useAppDispatch();
  const subreddits = useSelector((state: RootState) => state.subreddits.items);

  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  return (
    <aside className={styles.sideBar}>
      <ul className={styles.sideBar__list}>
        <h2 className={styles.sideBar__heading}>Subreddits</h2>
        {subreddits.map((subreddit: any) => (
          <li key={subreddit.id}>
            <NavLink
              to={`/r/${subreddit.title}`}
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              <img
                src={subreddit.icon_img || fallbackImg}
                alt='image'
              />
              {subreddit.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
