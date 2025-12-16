import { ReadingProgress } from '../types';
import { STORES } from './dbConfig';
import { executeTransaction } from './dbConnection';

// 保存阅读进度
export const saveReadingProgress = (progress: Omit<ReadingProgress, 'lastReadAt'>): Promise<ReadingProgress> => {
  return executeTransaction(STORES.READING_PROGRESS, 'readwrite', async (transaction) => {
    const store = transaction.objectStore(STORES.READING_PROGRESS);
    
    const fullProgress: ReadingProgress = {
      ...progress,
      lastReadAt: new Date(),
    };

    store.put(fullProgress);
    return fullProgress;
  });
};

// 获取阅读进度
export const getReadingProgress = (novelId: string): Promise<ReadingProgress | undefined> => {
  return executeTransaction(STORES.READING_PROGRESS, 'readonly', async (transaction) => {
    const store = transaction.objectStore(STORES.READING_PROGRESS);
    const request = store.get(novelId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get reading progress'));
    });
  });
};

// 清除阅读进度
export const clearReadingProgress = (novelId: string): Promise<void> => {
  return executeTransaction(STORES.READING_PROGRESS, 'readwrite', async (transaction) => {
    const store = transaction.objectStore(STORES.READING_PROGRESS);
    store.delete(novelId);
  });
};