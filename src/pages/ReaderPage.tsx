import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ReaderPage.module.less';
import { Chapter } from '../types';
import { useReadingContext } from '../contexts/ReadingContext';
import { Loading } from 'tdesign-mobile-react';
import ChapterList from '../components/ChapterList';
import ChapterNavigation from '../components/ChapterNavigation';
import { getAllNovels } from '../services/dbService';
import { getNovelChapters } from '../services/chapterService';
import { getReadingProgress, saveReadingProgress } from '../services/progressService';

const ReaderPage: React.FC = () => {
  const { novelId } = useParams<{ novelId: string }>();
  const { settings } = useReadingContext();

  // 新增状态管理
  const [novelTitle, setNovelTitle] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterNumber, setCurrentChapterNumber] = useState(1);
  const [initialScrollPosition, setInitialScrollPosition] = useState(0);

  const [showChapterList, setShowChapterList] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 加载小说数据
  useEffect(() => {
    if (!novelId) return;

    // 获取小说详情
    getAllNovels()
      .then(novelsList => {
        const novel = novelsList.find(n => n.id === novelId);
        if (novel) {
          setNovelTitle(novel.title);
          // 获取章节
          getNovelChapters(novelId)
            .then(chaptersData => {
              setChapters(chaptersData);
              // 获取阅读进度
              getReadingProgress(novelId)
                .then(progress => {
                  if (progress) {
                    setCurrentChapterNumber(progress.chapterNumber);
                    setInitialScrollPosition(progress.scrollPosition);
                  } else {
                    setCurrentChapterNumber(1);
                    setInitialScrollPosition(0);
                  }
                })
                .catch(error => {
                  console.error('Failed to get reading progress:', error);
                  setCurrentChapterNumber(1);
                  setInitialScrollPosition(0);
                });
            })
            .catch(error => {
              console.error('Failed to load chapters:', error);
              setChapters([]);
            });
        }
      })
      .catch(error => {
        console.error('Failed to get novel:', error);
      });
  }, [novelId]);

  // 获取当前章节
  const currentChapter = chapters.find(ch => ch.chapterNumber === currentChapterNumber) || chapters[0];

  // 保存阅读进度
  const saveProgress = useCallback(() => {
    if (!novelId || !currentChapter || !contentRef.current) return;

    const scrollPosition = settings.readingMode === 'scroll'
      ? contentRef.current.scrollTop
      : 0;

    saveReadingProgress({
      novelId,
      chapterId: currentChapter.id,
      chapterNumber: currentChapter.chapterNumber,
      scrollPosition,
    }).catch(error => {
      console.error('Failed to save reading progress:', error);
    });
  }, [currentChapter, novelId, settings.readingMode]);

  // 滚动事件处理
  const handleScroll = () => {
    if (settings.readingMode === 'scroll') {
      saveProgress();
    }
  };

  // 章节变化时保存进度并重置滚动位置
  useEffect(() => {
    saveProgress();
    if (contentRef.current && settings.readingMode === 'scroll') {
      contentRef.current.scrollTop = 0;
    }
  }, [currentChapterNumber, saveProgress, settings.readingMode]);

  // 初始加载时设置滚动位置
  useEffect(() => {
    if (contentRef.current && settings.readingMode === 'scroll') {
      contentRef.current.scrollTop = initialScrollPosition;
    }
  }, [initialScrollPosition, settings.readingMode]);

  // 切换章节
  const changeChapter = (chapterNumber: number) => {
    if (chapterNumber >= 1 && chapterNumber <= chapters.length) {
      setCurrentChapterNumber(chapterNumber);
      setShowChapterList(false);
    }
  };

  // 下一章
  const nextChapter = () => {
    changeChapter(currentChapterNumber + 1);
  };

  // 上一章
  const prevChapter = () => {
    changeChapter(currentChapterNumber - 1);
  };

  // 点击屏幕中央显示菜单
  const handleContentClick = () => {
    setIsMenuOpen(prev => !prev);
  };

  // 章节列表项点击处理
  const handleChapterItemClick = (chapterNumber: number) => {
    changeChapter(chapterNumber);
  };

  if (!novelId || !currentChapter || chapters.length === 0) {
    return <div className={styles['loading-container']}>
      <Loading theme="dots" size='40px' />
    </div>
  }

  return (
    <div
      className={`${styles['reader-container']} ${styles[settings.theme]}`}
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
      }}
    >
      {/* 顶部导航 */}
      <div className={styles['reader-header']} style={{ opacity: isMenuOpen ? 1 : 0 }}>
        <div className={styles['header-left']}>
          <button
            className={styles['nav-button']}
            onClick={() => window.history.back()}
          >
            ← 返回
          </button>
        </div>
        <div className={styles['header-center']}>
          <h1>{novelTitle}</h1>
        </div>
        <div className={styles['header-right']}>
          <button
            className={styles['nav-button']}
            onClick={() => setShowChapterList(true)}
          >
            目录
          </button>
        </div>
      </div>

      {/* 阅读内容区域 */}
      <div
        className={styles['reader-content-wrapper']}
        onClick={handleContentClick}
      >
        {/* 章节内容 */}
        <div
          ref={contentRef}
          className={styles['chapter-content']}
          onScroll={handleScroll}
          style={{
            fontSize: `${settings.fontSize}px`,
            fontFamily: settings.fontFamily,
            lineHeight: settings.lineSpacing,
          }}
        >
          <div className={styles['chapter-header']}>
            <h2 className={styles['chapter-title']}>第 {currentChapter.chapterNumber} 章 {currentChapter.title}</h2>
            <div className={styles['chapter-meta']}>
              <span>字数: {currentChapter.content?.length || 0} 字</span>
            </div>
          </div>
          {/* 将文本内容转换为段落 */}
          {currentChapter.content.split('\n').map((paragraph, index) => {
            if (!paragraph.trim()) return null;
            return <p key={index} className={styles['content-paragraph']}>{paragraph}</p>;
          })}
        </div>

        {/* 章节导航 */}
        <ChapterNavigation
          currentChapterNumber={currentChapterNumber}
          totalChapters={chapters.length}
          onPrevChapter={prevChapter}
          onNextChapter={nextChapter}
          onChapterInfoClick={() => setShowChapterList(true)}
        />
      </div>

      {/* 章节列表 */}
      <ChapterList
        novelTitle={novelTitle}
        chapters={chapters}
        currentChapterNumber={currentChapterNumber}
        isVisible={showChapterList}
        onClose={() => setShowChapterList(false)}
        onChapterClick={handleChapterItemClick}
      />
    </div>
  );
};

export default ReaderPage;