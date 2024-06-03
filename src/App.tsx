import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList/PostList';
import PostDetail from './components/PostDetail/PostDetail';
import NoResults from './components/NoResults/NoResults';
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
              path='post/:postId'
              element={<PostDetail />}
            />
            <Route
              path='no-results'
              element={<NoResults />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
