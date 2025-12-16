import { Chapter } from '../types';
import { STORES } from './dbConfig';
import { executeTransaction } from './dbConnection';

// 获取小说的所有章节
export const getNovelChapters = (novelId: string): Promise<Chapter[]> => {
  return executeTransaction(STORES.CHAPTERS, 'readonly', async (transaction) => {
    const store = transaction.objectStore(STORES.CHAPTERS);
    const index = store.index('novelId');
    const request = index.getAll(novelId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        // 按章节号排序
        const chapters = request.result.sort((a, b) => a.chapterNumber - b.chapterNumber);
        resolve(chapters);
      };
      request.onerror = () => reject(new Error('Failed to get chapters'));
    });
  });
};

// 获取指定章节
export const getChapter = (novelId: string, chapterNumber: number): Promise<Chapter | undefined> => {
  return executeTransaction(STORES.CHAPTERS, 'readonly', async (transaction) => {
    const store = transaction.objectStore(STORES.CHAPTERS);
    const index = store.index('novelId_chapterNumber');
    const request = index.get([novelId, chapterNumber]);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get chapter'));
    });
  });
};