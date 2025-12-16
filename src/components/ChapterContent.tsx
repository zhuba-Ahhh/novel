import React from 'react';
import styles from '../pages/ReaderPage.module.less';
import { Chapter, ReadingSettings } from '../types';

interface ChapterContentProps {
  currentChapter: Chapter;
  settings: ReadingSettings;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ currentChapter, settings }) => {
  if (!currentChapter) return null;

  return (
    <div
      className={styles['chapter-content']}
      style={{
        fontSize: `${settings.fontSize}px`,
        fontFamily: settings.fontFamily,
        lineHeight: settings.lineSpacing,
      }}
    >
      <div className={styles['chapter-header']}>
        <h2 className={styles['chapter-title']}>第 {currentChapter.chapterNumber} 章 {currentChapter.title}</h2>
        <div className={styles['chapter-meta']}>
          <span>字数: {currentChapter.content?.length || 0} 字</span>
        </div>
      </div>
      {/* 将文本内容转换为段落 */}
      {currentChapter.content.split('\n').map((paragraph, index) => {
        if (!paragraph.trim()) return null;
        return <p key={index} className={styles['content-paragraph']}>{paragraph}</p>;
      })}
    </div>
  );
};

export default ChapterContent;
