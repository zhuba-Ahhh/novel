import { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import { Novel, ParsedNovel } from '../types';
import { saveNovel, getAllNovels } from '../services/dbService';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="bookshelf">      
      {/* 文件上传组件 */}
      <div className="upload-section">
        <FileUploader onNovelParsed={handleNovelParsed} />
      </div>

      {/* 小说列表 */}
      <div className="novels-list">
        <h2>我的书架</h2>
        {novels.length === 0 ? (
          <p className="no-novels">还没有小说，上传一本TXT小说开始阅读吧！</p>
        ) : (
          <div className="novels-grid">
            {novels.map(novel => (
              <div 
                key={novel.id} 
                className="novel-card"
                onClick={() => openNovel(novel.id)}
              >
                <h3 className="novel-title">{novel.title}</h3>
                <p className="novel-author">作者：{novel.author}</p>
                <p className="novel-chapters">共 {novel.totalChapters} 章</p>
                <div className="novel-meta">
                  <span className="novel-date">
                    上传时间：{novel.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookshelfPage;