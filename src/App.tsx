import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import SearchBar from './components/SearchBar';
import styles from './App.module.scss';

const App = () => {
  return (
    <Router>
      <div className={styles.app}>
        <Header />
        <SearchBar />
        <Routes>
          <Route
            path='/'
            element={<PostList />}
          />
          <Route
            path='/post/:postId'
            element={<PostDetail />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
