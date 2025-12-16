import React from 'react';
import styles from '../pages/ReaderPage.module.less';
import { Chapter } from '../types';

interface ChapterListProps {
  novelTitle: string;
  chapters: Chapter[];
  currentChapterNumber: number;
  isVisible: boolean;
  onClose: () => void;
  onChapterClick: (chapterNumber: number) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  novelTitle,
  chapters,
  currentChapterNumber,
  isVisible,
  onClose,
  onChapterClick,
}) => {
  if (!isVisible) return null;

  const handleChapterItemClick = (chapter: Chapter) => {
    onChapterClick(chapter.chapterNumber);
  };

  return (
    <div className={styles['chapter-list']}>
      <div className={styles['chapter-list-header']}>
        <h3>{novelTitle} - 目录</h3>
        <button
          className={styles['close-button']}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className={styles['chapter-list-content']}>
        {chapters.map(chapter => (
          <div
            key={chapter.id}
            className={`${styles['chapter-item']} ${chapter.chapterNumber === currentChapterNumber ? styles['active'] : ''}`}
            onClick={() => handleChapterItemClick(chapter)}
          >
            <span className={styles['chapter-number']}>{chapter.chapterNumber}</span>
            <span className={styles['chapter-title']}>{chapter.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;