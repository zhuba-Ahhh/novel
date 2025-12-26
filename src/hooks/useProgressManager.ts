import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { debounce } from 'lodash-es';

import { saveReadingProgress } from '../services/progressService';
import {
  Chapter,
  ReadingSettings,
} from '../types';

export const useProgressManager = (
  novelId: string,
  currentChapter: Chapter | undefined,
  currentChapterNumber: number,
  settings: ReadingSettings,
  contentRef: React.RefObject<HTMLDivElement | null>,
  setHasScrolled: (value: boolean) => void
) => {
  const [isScrolling, setIsScrolling] = useState(false);

  // 防抖处理滚动结束
  const handleScrollEnd = useCallback(
    debounce(() => {
      setIsScrolling(false);
    }, 300),
    []
  )

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
      // 设置为正在滚动状态
      setIsScrolling(true);

      // 保存进度
      saveProgress();

      // 更新滚动状态
      if (contentRef?.current) {
        setHasScrolled(contentRef.current.scrollTop > 0);
      }

      // 触发防抖处理滚动结束
      handleScrollEnd();
    }
  }, [saveProgress, settings.readingMode, contentRef, setHasScrolled, handleScrollEnd]);

  // 组件卸载时清理防抖
  useEffect(() => {
    return () => {
      handleScrollEnd.cancel();
    };
  }, [handleScrollEnd]);

  // 章节变化时保存进度并重置滚动位置
  useEffect(() => {
    saveProgress();
    if (contentRef?.current && settings.readingMode === 'scroll') {
      contentRef.current.scrollTop = 0;
    }
  }, [currentChapterNumber, saveProgress, settings.readingMode, contentRef]);

  return {
    handleScroll,
    saveProgress,
    isScrolling
  };
};
