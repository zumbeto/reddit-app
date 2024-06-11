import { NavLink, useNavigate } from 'react-router-dom';
import { fetchSubreddits } from '../../features/subreddits/subredditsSlice';
import { useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../store';
import styles from './SideBar.module.scss';
import fallbackImg from '../../assets/images/no-image.png';
import Loader from '../Loaders/Loader';

const SideBar = () => {
  const dispatch = useAppDispatch();
  const subreddits = useSelector((state: RootState) => state.subreddits.items);
  const status = useSelector((state: RootState) => state.subreddits.status);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  const handleSubredditClick = (subreddit: string) => {
    navigate(`/r/${subreddit}`);
    window.scrollTo(0, 0);
  };

  return (
    <aside className={styles.sideBar}>
      <ul className={styles.sideBar__list}>
        <h2 className={styles.sideBar__heading}>Subreddits</h2>
        {status === 'loading' ? (
          <Loader component={SideBar} />
        ) : (
          subreddits.map((subreddit: any) => (
            <li key={subreddit.id}>
              <NavLink
                to={`/r/${subreddit.title}`}
                className={({ isActive }) => (isActive ? styles.active : '')}
                onClick={() => handleSubredditClick(subreddit.title)}
              >
                <img
                  src={subreddit.icon_img || fallbackImg}
                  alt='image'
                />
                {subreddit.title}
              </NavLink>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default SideBar;
