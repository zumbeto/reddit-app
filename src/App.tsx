import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList/PostList';
import NoResults from './components/NoResults/NoResults';
import PostDetailsPage from './components/PostDetails/PostDetailsPage';
import styles from './App.module.scss';
import Root from './components/Root/Root';

const App = () => {
  return (
    <Router>
      <div className={styles.app}>
        <Routes>
          <Route
            path='/'
            element={<Root />}
          >
            <Route
              index
              element={<PostList />}
            />
            <Route
              path='no-results'
              element={<NoResults />}
            />
            <Route
              path='r/:subreddit'
              element={<PostList />}
            />
            <Route
              path='r/:subreddit/post/:postId'
              element={<PostDetailsPage />}
            />
            <Route
              path='search/:query'
              element={<PostList />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
