import React from 'react';
import { Button, Navbar } from 'tdesign-mobile-react';
import styles from './ReaderHeader.module.less';

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

  return (
    <Navbar
      leftArrow
      right={
        <Button
          className={styles['nav-button']}
          onClick={onShowChapterList}
          variant="text"
        >
          目录
        </Button>
      }
      onLeftClick={onBack}
      style={{ zIndex: 10 }}
    >
      {novelTitle}
    </Navbar>
  );
};

export default ReaderHeader;
