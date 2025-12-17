import { useState, useEffect } from 'react';
import { Button, Dialog, Input, Loading } from 'tdesign-mobile-react';
import { Novel, ReadingProgress, Chapter } from '@/types';
import { getReadingProgress } from '@/services/progressService';
import { getChapter } from '@/services/chapterService';
import styles from './index.module.less';

interface NovelCardProps {
  novel: Novel;
  onOpen: (novelId: string) => void;
  onDelete: (novelId: string) => void;
  onUpdate: (novel: Novel) => void;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel, onOpen, onDelete, onUpdate }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(novel.title);
  const [editedAuthor, setEditedAuthor] = useState(novel.author);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // 添加状态用于存储阅读进度和当前章节信息
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | undefined>(undefined);
  const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // 获取阅读进度和当前章节信息
  useEffect(() => {
    const fetchReadingProgress = async () => {
      try {
        setIsLoading(true);
        const progress = await getReadingProgress(novel.id);
        setReadingProgress(progress);

        if (progress) {
          const chapter = await getChapter(novel.id, progress.chapterNumber);
          setCurrentChapter(chapter);
        }
      } catch (error) {
        console.error('Failed to fetch reading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadingProgress();
  }, [novel.id]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    onUpdate({
      ...novel,
      title: editedTitle,
      author: editedAuthor,
    });
    setIsEditDialogOpen(false);
  };

  return (
    <div className={styles['novel-card-container']}>
      <div className={styles['novel-card']} onClick={() => onOpen(novel.id)}>
        <div className={styles['novel-title']}>{novel.title}</div>
        <p className={styles['novel-author']}>作者：{novel.author}</p>
        <p className={styles['novel-chapters']}>共 {novel.totalChapters} 章</p>
        {/* 显示阅读进度和当前章节 */}
        <div className={styles['reading-progress']}>
          {isLoading ? (
            <Loading theme="dots" size='40px' />
          ) : readingProgress ? (
            <>
              <div className={styles['progress-info']}>
                <div className={styles['progress-label']}>当前阅读</div>
                <div className={styles['progress-chapter']}>
                  <span className={styles['chapter-number']}>{readingProgress.chapterNumber}.</span>
                  <span className={styles['chapter-title']}>{currentChapter?.title || '未知'}</span>
                </div>
              </div>
              <div className={styles['progress-last-read']}>
                最后阅读：{new Date(readingProgress.lastReadAt).toLocaleString()}
              </div>
            </>
          ) : (
            <div className={styles['no-progress']}>
              <span className={styles['no-progress-icon']}>📖</span>
              <span className={styles['no-progress-text']}>还未开始阅读</span>
            </div>
          )}
        </div>
        <div className={styles['novel-meta']}>
          <span className={styles['novel-date']}>上传时间：{novel.updatedAt.toLocaleDateString()}</span>
        </div>
        <div className={styles['novel-actions']}>
          <Button size="small" variant="outline" onClick={handleEditClick}>编辑</Button>
          <Button size="small" variant="outline" theme="danger" onClick={handleDeleteClick}>删除</Button>
        </div>
      </div>

      <Dialog
        key={`edit-dialog-${novel.id}`}
        visible={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="编辑小说信息"
        actions={[
          { content: '取消', onClick: () => setIsEditDialogOpen(false) },
          { content: '保存', onClick: handleSaveEdit },
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>书名</div>
            <Input value={editedTitle} onChange={(value) => setEditedTitle(String(value))} placeholder="请输入书名" />
          </div>
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>作者</div>
            <Input value={editedAuthor} onChange={(value) => setEditedAuthor(String(value))} placeholder="请输入作者" />
          </div>
        </div>
      </Dialog>

      <Dialog
        key={`delete-dialog-${novel.id}`}
        visible={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="删除确认"
        actions={[
          { content: '取消', onClick: () => setIsDeleteDialogOpen(false) },
          { content: '删除', onClick: () => { setIsDeleteDialogOpen(false); onDelete(novel.id); } },
        ]}
      >
        确定要删除这本小说吗？
      </Dialog>
    </div>
  );
};

export { NovelCard };
