import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.less';
import { BookshelfPage, ReaderPage } from './pages';
import { ReadingProvider } from './contexts/ReadingContext';
import { useMemo } from 'react';

const App = () => {
  const isProd = process.env.NODE_ENV === 'production';

  const basename = useMemo(() => {
    const isGithubPages = window.location.hostname.includes("github.io");
    return isProd && isGithubPages ? '/novel' : '/';
  }, [isProd])

  return (
    <ReadingProvider>
      <Router basename={basename}>
        <div className={styles['app-container']}>
          <Routes>
            <Route path="/shelf" element={<BookshelfPage />} />
            <Route path="/reader/:novelId" element={<ReaderPage />} />
            <Route path="*" element={<BookshelfPage />} />
          </Routes>
        </div>
      </Router>
    </ReadingProvider>
  );
};

export default App
