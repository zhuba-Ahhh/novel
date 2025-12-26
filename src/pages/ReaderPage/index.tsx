import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  BackTop,
  Loading,
} from 'tdesign-mobile-react';

import {
  ChapterContent,
  ChapterList,
  ChapterNavigation,
  ReaderHeader,
} from '@/components';
import { ReaderSetting } from '@/components/ReaderSetting';
import { useReadingContext } from '@/contexts/ReadingContext';
import { useChapterNavigation } from '@/hooks/useChapterNavigation';
import { useNovelDataLoader } from '@/hooks/useNovelDataLoader';
import { useProgressManager } from '@/hooks/useProgressManager';

import styles from './index.module.less';

const ReaderPage: React.FC = () => {
  const { novelId } = useParams<{ novelId: string }>();
  const { settings } = useReadingContext();

  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
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
    const chapter = chapters.find(ch => ch.chapterNumber === currentChapterNumber);
    return chapter || chapters?.[0];
  }, [chapters, currentChapterNumber]);

  useLayoutEffect(() => {
    if (!currentChapter || chapters.length == 0) {
      navigate(``);
    }
  }, [currentChapter, navigate, chapters]);

  // 使用自定义Hook管理阅读进度
  const { handleScroll, isScrolling } = useProgressManager(
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
        {
          !isScrolling && <ChapterNavigation
            currentChapterNumber={currentChapterNumber}
            totalChapters={chapters.length}
            onPrevChapter={prevChapter}
            onNextChapter={nextChapter}
            onChapterInfoClick={() => setShowChapterList(true)}
          />
        }
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
      {
        !showSettingsPanel &&
        <BackTop
          text='返回顶部'
          theme='half-round'
          container={() => contentRef.current || document.body}
          style={{
            // @ts-ignore
            '--td-spacer-2': '72px'
          }}
        />
      }

      <ReaderSetting
        isScrolling={isScrolling}
        showSettingsPanel={showSettingsPanel}
        setShowSettingsPanel={setShowSettingsPanel}
      />

    </div>
  );
};

export { ReaderPage };