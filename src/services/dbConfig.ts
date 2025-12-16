// 数据库名称和版本
export const DB_NAME = 'novelReaderDB';
export const DB_VERSION = 1;

// 存储对象名称
export const STORES = {
  NOVELS: 'novels',
  CHAPTERS: 'chapters',
  READING_PROGRESS: 'readingProgress',
};

// 生成唯一 ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};