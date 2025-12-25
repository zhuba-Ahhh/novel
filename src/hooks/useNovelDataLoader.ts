import { useEffect, useState } from 'react';
import { Chapter } from '../types';
import { getAllNovels } from '../services/dbService';
import { getNovelChapters } from '../services/chapterService';
import { getReadingProgress } from '../services/progressService';
import { useNavigate } from 'react-router-dom';

export const useNovelDataLoader = (novelId: string | undefined) => {
  const [novelTitle, setNovelTitle] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterNumber, setCurrentChapterNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!novelId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 获取小说详情
    getAllNovels()
      .then(novelsList => {
        const novel = novelsList.find(n => n.id === novelId);
        if (novel) {
          setNovelTitle(novel.title);
          // 获取章节
          return getNovelChapters(novelId);
        }
        navigate(`/shelf`);
        return Promise.resolve([]);
      })
      .then(chaptersData => {
        setChapters(chaptersData);
        if (chaptersData.length > 0) {
          // 获取阅读进度
          return getReadingProgress(novelId!);
        }
        return Promise.resolve(null);
      })
      .then(progress => {
        if (progress) {
          setCurrentChapterNumber(progress.chapterNumber);
        } else {
          setCurrentChapterNumber(1);
        }
      })
      .catch(error => {
        console.error('Failed to load novel data:', error);
        setChapters([]);
        setCurrentChapterNumber(1);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [novelId]);

  return {
    novelTitle,
    chapters,
    currentChapterNumber,
    setCurrentChapterNumber,
    loading
  };
};
