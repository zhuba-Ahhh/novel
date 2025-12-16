import { useCallback, useEffect } from 'react';
import { Chapter } from '../types';
import { ReadingSettings } from '../types';
import { saveReadingProgress } from '../services/progressService';

export const useProgressManager = (
  novelId: string,
  currentChapter: Chapter | undefined,
  currentChapterNumber: number,
  settings: ReadingSettings,
  contentRef: React.RefObject<HTMLDivElement | null>,
  setHasScrolled: (value: boolean) => void
) => {
  // 保存阅读进度
  const saveProgress = useCallback(() => {
    if (!novelId || !currentChapter) return;

    saveReadingProgress({
      novelId,
      chapterId: currentChapter.id,
      chapterNumber: currentChapter.chapterNumber,
    }).catch(error => {
      console.error('Failed to save reading progress:', error);
    });
  }, [currentChapter, novelId]);

  // 滚动事件处理
  const handleScroll = useCallback(() => {
    if (settings.readingMode === 'scroll') {
      saveProgress();
      if (contentRef?.current) {
        setHasScrolled(contentRef.current.scrollTop > 0);
      }
    }
  }, [saveProgress, settings.readingMode, contentRef, setHasScrolled]);

  // 章节变化时保存进度并重置滚动位置
  useEffect(() => {
    saveProgress();
    if (contentRef?.current && settings.readingMode === 'scroll') {
      contentRef.current.scrollTop = 0;
    }
  }, [currentChapterNumber, saveProgress, settings.readingMode, contentRef]);

  return {
    handleScroll,
    saveProgress
  };
};
