// import { useReadingContext } from '@/contexts/ReadingContext';
import React from 'react';

import {
  Button,
  Navbar,
} from 'tdesign-mobile-react';

interface ReaderHeaderProps {
  novelTitle: string;
  onBack: () => void;
  onShowChapterList: () => void;
}

const ReaderHeader: React.FC<ReaderHeaderProps> = ({
  novelTitle,
  onBack,
  onShowChapterList,
}) => {
  // const { settings } = useReadingContext();

  return (
    <Navbar
      leftArrow
      right={
        <Button
          onClick={onShowChapterList}
          variant="text"
        >
          目录
        </Button>
      }
      onLeftClick={onBack}
      style={{
        zIndex: 10,
        // @ts-ignore
        // '--td-navbar-color': settings.textColor,
        // @ts-ignore
        // '--td-navbar-bg-color': settings.backgroundColor,
        // opacity: 0.9,
      }}
    >
      {novelTitle}
    </Navbar>
  );
};

export { ReaderHeader };
