import {
  Chapter,
  Novel,
  ParsedNovel,
} from '../types';
import {
  generateId,
  STORES,
} from './dbConfig';
import {
  executeTransaction,
  wrapRequest,
} from './dbConnection';

// 保存小说和章节
export const saveNovel = async (parsedNovel: ParsedNovel): Promise<Novel> => {
  return executeTransaction([STORES.NOVELS, STORES.CHAPTERS], 'readwrite', async (transaction) => {
    const novelStore = transaction.objectStore(STORES.NOVELS);
    const chapterStore = transaction.objectStore(STORES.CHAPTERS);

    // 创建小说对象
    const novel: Novel = {
      ...parsedNovel.novel,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 保存小说
    await wrapRequest(novelStore.add(novel));

    // 保存章节
    for (const chapterData of parsedNovel.chapters) {
      const chapter: Chapter = {
        ...chapterData,
        id: generateId(),
        novelId: novel.id,
      };
      await wrapRequest(chapterStore.add(chapter));
    }

    return novel;
  });
};

// 获取所有小说
export const getAllNovels = (): Promise<Novel[]> => {
  return executeTransaction(STORES.NOVELS, 'readonly', async (transaction) => {
    const store = transaction.objectStore(STORES.NOVELS);
    const request = store.getAll();
    return await wrapRequest(request);
  });
};

// 根据 ID 获取小说
export const getNovelById = (novelId: string): Promise<Novel | undefined> => {
  return executeTransaction(STORES.NOVELS, 'readonly', async (transaction) => {
    const store = transaction.objectStore(STORES.NOVELS);
    const request = store.get(novelId);
    return await wrapRequest(request);
  });
};

// 删除小说
export const deleteNovel = async (novelId: string): Promise<void> => {
  return executeTransaction([STORES.NOVELS, STORES.CHAPTERS, STORES.READING_PROGRESS], 'readwrite', async (transaction) => {
    const novelStore = transaction.objectStore(STORES.NOVELS);
    const chapterStore = transaction.objectStore(STORES.CHAPTERS);
    const progressStore = transaction.objectStore(STORES.READING_PROGRESS);

    // 删除小说
    await wrapRequest(novelStore.delete(novelId));

    // 删除相关章节
    const chapterIndex = chapterStore.index('novelId');
    const chapterCursor = chapterIndex.openCursor(novelId);
    
    await new Promise<void>((resolve, reject) => {
      chapterCursor.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      chapterCursor.onerror = () => reject(new Error('Failed to delete chapters'));
    });

    // 删除阅读进度
    await wrapRequest(progressStore.delete(novelId));
  });
};

// 更新小说
export const updateNovel = async (novel: Novel): Promise<Novel> => {
  return executeTransaction(STORES.NOVELS, 'readwrite', async (transaction) => {
    const store = transaction.objectStore(STORES.NOVELS);
    const updatedNovel: Novel = {
      ...novel,
      updatedAt: new Date(),
    };
    await wrapRequest(store.put(updatedNovel));
    return updatedNovel;
  });
};