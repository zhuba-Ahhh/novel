import { useState, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ReaderPage.module.less';
import { useReadingContext } from '../contexts/ReadingContext';
import { BackTop, Loading } from 'tdesign-mobile-react';
import { ChapterList, ChapterNavigation, ReaderHeader, ChapterContent } from '@/components';
import { useNovelDataLoader } from '../hooks/useNovelDataLoader';
import { useProgressManager } from '../hooks/useProgressManager';
import { useChapterNavigation } from '../hooks/useChapterNavigation';

const ReaderPage: React.FC = () => {
  const { novelId } = useParams<{ novelId: string }>();
  const { settings } = useReadingContext();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const [showChapterList, setShowChapterList] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // 使用自定义Hook加载小说数据
  const {
    novelTitle,
    chapters,
    currentChapterNumber,
    setCurrentChapterNumber,
    loading
  } = useNovelDataLoader(novelId);

  // 优化性能：使用useMemo获取当前章节
  const currentChapter = useMemo(() => {
    return chapters.find(ch => ch.chapterNumber === currentChapterNumber) || chapters[0];
  }, [chapters, currentChapterNumber]);

  // 使用自定义Hook管理阅读进度
  const { handleScroll } = useProgressManager(
    novelId || '',
    currentChapter,
    currentChapterNumber,
    settings,
    contentRef,
    setHasScrolled
  );

  // 使用自定义Hook处理章节导航
  const {
    nextChapter,
    prevChapter,
    handleChapterItemClick
  } = useChapterNavigation(
    currentChapterNumber,
    chapters.length,
    setCurrentChapterNumber,
    () => setShowChapterList(false)
  );

  // 动态标题
  const dynamicTitle = useMemo(() => {
    if (!hasScrolled) {
      return novelTitle;
    }
    const chapterTitle = currentChapter ? `第 ${currentChapter.chapterNumber} 章 ${currentChapter.title}` : '';
    return `${novelTitle} - ${chapterTitle}`;
  }, [novelTitle, currentChapter, hasScrolled]);

  if (loading || !novelId || !currentChapter || chapters.length === 0) {
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
        <ChapterContent currentChapter={currentChapter} settings={settings} />

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