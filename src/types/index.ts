// 小说元数据类型
export interface Novel {
  id: string;
  title: string;
  author: string;
  cover?: string;
  totalChapters: number;
  createdAt: Date;
  updatedAt: Date;
}

// 章节类型
export interface Chapter {
  id: string;
  novelId: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  originalTitle: string;
}

// 阅读进度类型
export interface ReadingProgress {
  novelId: string;
  chapterId: string;
  chapterNumber: number;
  lastReadAt: Date;
}

// 阅读设置类型
export interface ReadingSettings {
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  backgroundColor: string;
  textColor: string;
  theme: 'light' | 'dark' | 'sepia';
  readingMode: 'scroll' | 'page';
}

// 解析后的小说数据
export interface ParsedNovel {
  novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>;
  chapters: Array<Omit<Chapter, 'id' | 'novelId'>>;
}

// 文件上传状态
export interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error?: string;
  success?: boolean;
}