import { useState, useEffect } from 'react';

import { Novel, ParsedNovel } from '@/types';
import { saveNovel, getAllNovels, deleteNovel, updateNovel } from '@/services';
import { useNavigate } from 'react-router-dom';
import styles from './BookshelfPage.module.less';
import { BottomBar, FileUploader, BookshelfHeader, BookshelfContent } from '@/components';

const BookshelfPage: React.FC = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const navigate = useNavigate();

  // 加载所有小说
  const loadNovels = () => {
    getAllNovels()
      .then(fetchedNovels => {
        setNovels(fetchedNovels);
      })
      .catch(error => {
        console.error('Failed to load novels:', error);
      });
  };

  // 初始化加载小说列表
  useEffect(() => {
    loadNovels();
  }, []);

  // 处理小说解析完成
  const handleNovelParsed = (parsedNovel: ParsedNovel) => {
    saveNovel(parsedNovel)
      .then(savedNovel => {
        loadNovels(); // 更新小说列表
        // 自动打开新上传的小说
        navigate(`/reader/${savedNovel.id}`);
      })
      .catch(error => {
        console.error('Failed to save novel:', error);
      });
  };

  // 打开小说
  const openNovel = (novelId: string) => {
    navigate(`/reader/${novelId}`);
  };

  // 删除小说
  const handleDeleteNovel = async (novelId: string) => {
    try {
      await deleteNovel(novelId);
      loadNovels(); // 更新小说列表
    } catch (error) {
      console.error('Failed to delete novel:', error);
    }
  };

  // 更新小说
  const handleUpdateNovel = async (updatedNovel: Novel) => {
    try {
      await updateNovel(updatedNovel);
      loadNovels(); // 更新小说列表
    } catch (error) {
      console.error('Failed to update novel:', error);
    }
  };

  return (
    <div className={styles['bookshelf']}>
      {/* 文件上传组件 */}
      <div className={styles['upload-section']}>
        <FileUploader onNovelParsed={handleNovelParsed} />
      </div>

      {/* 书架头部 */}
      <BookshelfHeader layout={layout} onLayoutChange={setLayout} />

      {/* 小说内容区域 */}
      <BookshelfContent
        novels={novels}
        layout={layout}
        onOpenNovel={openNovel}
        onDeleteNovel={handleDeleteNovel}
        onUpdateNovel={handleUpdateNovel}
      />

      <BottomBar
        defaultSelected="shelf"
        itemList={[
          { value: 'shelf', label: '书架' },
          { value: 'user', label: '我的' },
        ]}
      />
    </div>
  );
};

export default BookshelfPage;