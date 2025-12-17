import { useState, useEffect } from 'react';

import { Novel, ParsedNovel } from '@/types';
import { saveNovel, getAllNovels, deleteNovel, updateNovel } from '@/services';
import { useNavigate } from 'react-router-dom';
import styles from './BookshelfPage.module.less';
import { BottomBar, FileUploader, NovelCard } from '@/components';

const BookshelfPage: React.FC = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
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

      {/* 小说列表 */}
      <div className={styles['novels-list']}>
        <h2>我的书架</h2>
        {novels.length === 0 ? (
          <p className={styles['no-novels']}>还没有小说，上传一本TXT小说开始阅读吧！</p>
        ) : (
            <div className={styles['novels-grid']}>
            {novels.map(novel => (
              <NovelCard
                key={novel.id}
                novel={novel}
                onOpen={openNovel}
                onDelete={handleDeleteNovel}
                onUpdate={handleUpdateNovel}
              />
            ))}
          </div>
        )}
      </div>
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