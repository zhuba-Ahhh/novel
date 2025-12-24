import { Button } from 'tdesign-mobile-react';
import styles from './BookshelfHeader.module.less';
import listIcon from '@/assets/svg/list.svg';
import gridIcon from '@/assets/svg/card.svg';

interface BookshelfHeaderProps {
  layout: 'list' | 'grid';
  onLayoutChange: (layout: 'list' | 'grid') => void;
}

const BookshelfHeader: React.FC<BookshelfHeaderProps> = ({ layout, onLayoutChange }) => {
  return (
    <div className={styles['bookshelf-header']}>
      <h2 className={styles['header-title']}>我的书架</h2>
      <div className={styles['header-actions']}>
        <Button
          variant="text"
          onClick={() => onLayoutChange('list')}
          className={layout === 'list' ? styles['active'] : ''}
          icon={<img src={listIcon} className={styles['icon']} />}
        >
          列表
        </Button>
        <Button
          variant="text"
          onClick={() => onLayoutChange('grid')}
          className={layout === 'grid' ? styles['active'] : ''}
          icon={<img src={gridIcon} className={styles['icon']} />}
        >
          卡片
        </Button>
      </div>
    </div>
  );
};

export { BookshelfHeader };