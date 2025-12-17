import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.less';
import BookshelfPage from './pages/BookshelfPage';
import ReaderPage from './pages/ReaderPage';
import { ReadingProvider } from './contexts/ReadingContext';

const App = () => {

  return (
    <ReadingProvider>
      <Router basename={process.env.NODE_ENV === 'production' ? '/novel' : '/'}>
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
