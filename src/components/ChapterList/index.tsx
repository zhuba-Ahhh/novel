import React from 'react';

import { Drawer } from 'tdesign-mobile-react';

import { Chapter } from '@/types';

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
  isVisible,
  onClose,
  onChapterClick,
}) => {

  return (
    <Drawer
      visible={isVisible}
      placement="right"
      title={`${novelTitle} - 目录`}
      onClose={onClose}
      // @ts-ignore
      style={{ width: '100%', maxWidth: '300px', '--td-drawer-sidebar-height': '100%' }}
      items={chapters.map((chapter, index) => ({
        title: `${index + 1}. ${chapter.title}`,
      }))}
      onItemClick={(index: string | number) => {
        onChapterClick(chapters[Number(index)].chapterNumber);
      }}
    />  
  );
};

export { ChapterList };