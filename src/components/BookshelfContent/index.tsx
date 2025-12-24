import { Novel } from '@/types';
import { NovelCard } from '../NovelCard';
import styles from './index.module.less';

interface BookshelfContentProps {
  novels: Novel[];
  layout: 'list' | 'grid';
  onOpenNovel: (novelId: string) => void;
  onDeleteNovel: (novelId: string) => void;
  onUpdateNovel: (novel: Novel) => void;
}

const BookshelfContent: React.FC<BookshelfContentProps> = ({ 
  novels, 
  layout, 
  onOpenNovel, 
  onDeleteNovel, 
  onUpdateNovel 
}) => {
  if (novels.length === 0) {
    return (
      <div className={styles['empty-state']}>
        <div className={styles['empty-icon']}>📚</div>
        <p className={styles['empty-text']}>还没有小说，上传一本TXT小说开始阅读吧！</p>
      </div>
    );
  }

  return (
    <div className={`${styles['bookshelf-content']} ${styles[`layout-${layout}`]}`}>
      {novels.map(novel => (
        <div key={novel.id} className={styles['novel-item']}>
          <NovelCard
            novel={novel}
            onOpen={onOpenNovel}
            onDelete={onDeleteNovel}
            onUpdate={onUpdateNovel}
          />
        </div>
      ))}
    </div>
  );
};

export { BookshelfContent };
