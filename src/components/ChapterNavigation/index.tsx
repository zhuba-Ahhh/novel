import React from 'react';
import { Button } from 'tdesign-mobile-react';
import styles from './index.module.less';
// import { useReadingContext } from '@/contexts/ReadingContext';

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
  // const { settings } = useReadingContext();

  return (
    <div className={styles['chapter-navigation']} style={{
      // backgroundColor: settings.backgroundColor,
      // color: settings.textColor,
    }}>
      <Button
        size="small"
        theme="light"
        onClick={onPrevChapter}
        disabled={currentChapterNumber <= 1}
        style={{
          // color: settings.textColor,
        }}
      >
        上一章
      </Button>
      <span className={styles['chapter-navigation__info']} onClick={onChapterInfoClick} style={{
        // color: settings.textColor,
      }}>
        {currentChapterNumber} / {totalChapters}
      </span>
      <Button
        size="small"
        theme="light"
        onClick={onNextChapter}
        disabled={currentChapterNumber >= totalChapters}
        style={{
          // color: settings.textColor,
        }}
      >
        下一章
      </Button>
    </div>
  );
};

export { ChapterNavigation };