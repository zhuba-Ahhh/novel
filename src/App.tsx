import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import BookshelfPage from './pages/BookshelfPage';
import ReaderPage from './pages/ReaderPage';
import { ReadingProvider } from './contexts/ReadingContext';

function App() {
  return (
    <ReadingProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<BookshelfPage />} />
            <Route path="/reader/:novelId" element={<ReaderPage />} />
          </Routes>
        </div>
      </Router>
    </ReadingProvider>
  );
}

export default App
