import { Novel, Chapter, ReadingProgress, ParsedNovel } from '../types';

// 数据库名称和版本
const DB_NAME = 'novelReaderDB';
const DB_VERSION = 1;

// 存储对象名称
const STORES = {
  NOVELS: 'novels',
  CHAPTERS: 'chapters',
  READING_PROGRESS: 'readingProgress',
};

// 打开数据库连接
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // 数据库升级或首次创建
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 创建小说存储对象
      if (!db.objectStoreNames.contains(STORES.NOVELS)) {
        const novelStore = db.createObjectStore(STORES.NOVELS, { keyPath: 'id' });
        novelStore.createIndex('title', 'title', { unique: false });
        novelStore.createIndex('author', 'author', { unique: false });
      }

      // 创建章节存储对象
      if (!db.objectStoreNames.contains(STORES.CHAPTERS)) {
        const chapterStore = db.createObjectStore(STORES.CHAPTERS, { keyPath: 'id' });
        chapterStore.createIndex('novelId', 'novelId', { unique: false });
        chapterStore.createIndex('chapterNumber', 'chapterNumber', { unique: false });
        chapterStore.createIndex('novelId_chapterNumber', ['novelId', 'chapterNumber'], { unique: true });
      }

      // 创建阅读进度存储对象
      if (!db.objectStoreNames.contains(STORES.READING_PROGRESS)) {
        db.createObjectStore(STORES.READING_PROGRESS, { keyPath: 'novelId' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };
  });
};

// 执行事务操作
const executeTransaction = <T>(
  storeNames: string | string[],
  mode: IDBTransactionMode,
  callback: (transaction: IDBTransaction) => Promise<T>
): Promise<T> => {
  return openDB().then((db) => {
    const transaction = db.transaction(storeNames, mode);
    
    return callback(transaction).then((result) => {
      transaction.oncomplete = () => {
        db.close();
      };
      return result;
    }).catch((error) => {
      transaction.abort();
      db.close();
      throw error;
    });
  });
};

// 生成唯一 ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 保存小说和章节
export const saveNovel = (parsedNovel: ParsedNovel): Promise<Novel> => {
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
    await novelStore.add(novel);

    // 保存章节
    for (const chapterData of parsedNovel.chapters) {
      const chapter: Chapter = {
        ...chapterData,
        id: generateId(),
        novelId: novel.id,
      };
      await chapterStore.add(chapter);
    }

    return novel;
  });
};

// 获取所有小说
export const getAllNovels = (): Promise<Novel[]> => {
  return executeTransaction(STORES.NOVELS, 'readonly', async (transaction) => {
    const store = transaction.objectStore(STORES.NOVELS);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get novels'));
    });
  });
};

// 根据 ID 获取小说
export const getNovelById = (novelId: string): Promise<Novel | undefined> => {
  return executeTransaction(STORES.NOVELS, 'readonly', async (transaction) => {
    const store = transaction.objectStore(STORES.NOVELS);
    const request = store.get(novelId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get novel'));
    });
  });
};

// 删除小说
export const deleteNovel = async (novelId: string): Promise<void> => {
  return executeTransaction([STORES.NOVELS, STORES.CHAPTERS, STORES.READING_PROGRESS], 'readwrite', async (transaction) => {
    const novelStore = transaction.objectStore(STORES.NOVELS);
    const chapterStore = transaction.objectStore(STORES.CHAPTERS);
    const progressStore = transaction.objectStore(STORES.READING_PROGRESS);

    // 删除小说
    await novelStore.delete(novelId);

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
    await progressStore.delete(novelId);
  });
};

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

// 保存阅读进度
export const saveReadingProgress = (progress: Omit<ReadingProgress, 'lastReadAt'>): Promise<ReadingProgress> => {
  return executeTransaction(STORES.READING_PROGRESS, 'readwrite', async (transaction) => {
    const store = transaction.objectStore(STORES.READING_PROGRESS);
    
    const fullProgress: ReadingProgress = {
      ...progress,
      lastReadAt: new Date(),
    };

    await store.put(fullProgress);
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
    await store.delete(novelId);
  });
};