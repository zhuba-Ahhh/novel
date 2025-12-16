import { useCallback } from 'react';

export const useChapterNavigation = (
  currentChapterNumber: number,
  totalChapters: number,
  onChapterChange: (chapterNumber: number) => void,
  onShowChapterList?: () => void
) => {
  // 切换章节
  const changeChapter = useCallback((chapterNumber: number) => {
    if (chapterNumber >= 1 && chapterNumber <= totalChapters) {
      onChapterChange(chapterNumber);
    }
  }, [currentChapterNumber, totalChapters, onChapterChange]);

  // 下一章
  const nextChapter = useCallback(() => {
    changeChapter(currentChapterNumber + 1);
  }, [currentChapterNumber, changeChapter]);

  // 上一章
  const prevChapter = useCallback(() => {
    changeChapter(currentChapterNumber - 1);
  }, [currentChapterNumber, changeChapter]);

  // 章节列表项点击处理
  const handleChapterItemClick = useCallback((chapterNumber: number) => {
    changeChapter(chapterNumber);
    if (onShowChapterList) {
      onShowChapterList();
    }
  }, [changeChapter, onShowChapterList]);

  return {
    nextChapter,
    prevChapter,
    handleChapterItemClick,
    changeChapter
  };
};
