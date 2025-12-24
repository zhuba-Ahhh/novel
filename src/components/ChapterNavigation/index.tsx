import React from 'react';
import { Button } from 'tdesign-mobile-react';
import styles from './index.module.less';

interface ChapterNavigationProps {
  currentChapterNumber: number;
  totalChapters: number;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onChapterInfoClick: () => void;
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  currentChapterNumber,
  totalChapters,
  onPrevChapter,
  onNextChapter,
  onChapterInfoClick,
}) => {
  return (
    <div className={styles['chapter-navigation']}>
      <Button
        size="small"
        theme="light"
        onClick={onPrevChapter}
        disabled={currentChapterNumber <= 1}
      >
        上一章
      </Button>
      <span className={styles['chapter-navigation__info']} onClick={onChapterInfoClick}>
        {currentChapterNumber} / {totalChapters}
      </span>
      <Button
        size="small"
        theme="light"
        onClick={onNextChapter}
        disabled={currentChapterNumber >= totalChapters}
      >
        下一章
      </Button>
    </div>
  );
};

export { ChapterNavigation };