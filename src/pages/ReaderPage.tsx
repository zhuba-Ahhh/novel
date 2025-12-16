import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ReaderPage.module.less';
import { Chapter } from '../types';
import { useReadingContext } from '../contexts/ReadingContext';
import { BackTop, Loading } from 'tdesign-mobile-react';
import ChapterList from '../components/ChapterList';
import ChapterNavigation from '../components/ChapterNavigation';
import ReaderHeader from '../components/ReaderHeader';
import { getAllNovels } from '../services/dbService';
import { getNovelChapters } from '../services/chapterService';
import { getReadingProgress, saveReadingProgress } from '../services/progressService';

const ReaderPage: React.FC = () => {
  const { novelId } = useParams<{ novelId: string }>();
  const { settings } = useReadingContext();
  const navigate = useNavigate();

  // 新增状态管理
  const [novelTitle, setNovelTitle] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterNumber, setCurrentChapterNumber] = useState(1);

  const [showChapterList, setShowChapterList] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
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
              console.log('chaptersData:', chaptersData);
              setChapters(chaptersData);
              // 获取阅读进度
              getReadingProgress(novelId)
                .then(progress => {
                  if (progress) {
                    setCurrentChapterNumber(progress.chapterNumber);
                  } else {
                    setCurrentChapterNumber(1);
                  }
                })
                .catch(error => {
                  console.error('Failed to get reading progress:', error);
                  setCurrentChapterNumber(1);
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
    if (!novelId || !currentChapter) return;

    saveReadingProgress({
      novelId,
      chapterId: currentChapter.id,
      chapterNumber: currentChapter.chapterNumber,
    }).catch(error => {
      console.error('Failed to save reading progress:', error);
    });
  }, [currentChapter, novelId]);

  // 滚动事件处理
  const handleScroll = () => {
    if (settings.readingMode === 'scroll') {
      saveProgress();
      if (contentRef.current) {
        setHasScrolled(contentRef.current.scrollTop > 0);
      }
    }
  };

  // 章节变化时保存进度并重置滚动位置
  useEffect(() => {
    saveProgress();
    if (contentRef.current && settings.readingMode === 'scroll') {
      contentRef.current.scrollTop = 0;
    }
  }, [currentChapterNumber, saveProgress, settings.readingMode]);



  // 切换章节
  const changeChapter = (chapterNumber: number) => {
    if (chapterNumber >= 1 && chapterNumber <= chapters.length) {
      setCurrentChapterNumber(chapterNumber);
      setShowChapterList(false);
    }
  };

  // 动态标题
  const dynamicTitle = useMemo(() => {
    if (!hasScrolled) {
      return novelTitle;
    }
    const chapterTitle = currentChapter ? `第 ${currentChapter.chapterNumber} 章 ${currentChapter.title}` : '';
    return `${novelTitle} - ${chapterTitle}`;
  }, [novelTitle, currentChapter, hasScrolled]);

  // 下一章
  const nextChapter = () => {
    changeChapter(currentChapterNumber + 1);
  };

  // 上一章
  const prevChapter = () => {
    changeChapter(currentChapterNumber - 1);
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
      ref={contentRef}
      className={`${styles['reader-container']} ${styles[settings.theme]}`}
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
      }}
      onScroll={handleScroll}
    >
      {/* 顶部导航 */}
      <ReaderHeader
        novelTitle={dynamicTitle}
        onBack={() => navigate(-1)}
        onShowChapterList={() => setShowChapterList(true)}
      />

      {/* 阅读内容区域 */}
      <div
        className={styles['reader-content-wrapper']}
      >
        {/* 章节内容 */}
        <div
          className={styles['chapter-content']}
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
      <BackTop
        text='返回顶部'
        theme='half-round'
        container={() => contentRef.current || document.body}
        style={{
          // @ts-ignore
          '--td-spacer-2': '72px'
        }}
      />
    </div>
  );
};

export default ReaderPage;