import {
  DB_NAME,
  DB_VERSION,
  STORES,
} from './dbConfig';

// 打开数据库连接
export const openDB = (): Promise<IDBDatabase> => {
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

// 将 IndexedDB 请求包装成 Promise
export const wrapRequest = <T>(request: IDBRequest<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => {
      reject(new Error(`IndexedDB request failed`));
      console.error(e);
    };
  });
};

// 执行事务操作
export const executeTransaction = async <T>(
  storeNames: string | string[],
  mode: IDBTransactionMode,
  callback: (transaction: IDBTransaction) => Promise<T>
): Promise<T> => {
  const db = await openDB();
  const transaction = db.transaction(storeNames, mode);
  try {
    const result = await callback(transaction);
    transaction.oncomplete = () => {
      db.close();
    };
    return result;
  } catch (error) {
    transaction.abort();
    db.close();
    throw error;
  }
};