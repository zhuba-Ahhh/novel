import { ParsedNovel, Chapter } from '../types';

// 常见章节标题正则表达式模式
const CHAPTER_PATTERNS = [
  /^第\s*([零一二三四五六七八九十百千万]+)\s*[章节卷集]\s*([^\n]*)$/i, // 中文数字章节
  /^第\s*(\d+)\s*[章节卷集]\s*([^\n]*)$/i, // 阿拉伯数字章节
  /^\s*([零一二三四五六七八九十百千万]+)\s*[章节卷集]\s*([^\n]*)$/i, // 中文数字章节（无第字）
  /^\s*(\d+)\s*[章节卷集]\s*([^\n]*)$/i, // 阿拉伯数字章节（无第字）
  /^\s*第\s*([零一二三四五六七八九十百千万]+)\s*[章节卷集]\s*$/i, // 仅章节号
  /^\s*第\s*(\d+)\s*[章节卷集]\s*$/i, // 仅阿拉伯数字章节号
];

// 中文数字转阿拉伯数字
const chineseToArabic = (chinese: string): number => {
  const digits = { '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
  const units = { '十': 10, '百': 100, '千': 1000, '万': 10000 };
  
  let result = 0;
  let unit = 1;
  let prev = 0;
  
  for (let i = chinese.length - 1; i >= 0; i--) {
    const char = chinese[i];
    
    if (digits[char as keyof typeof digits] !== undefined) {
      const digit = digits[char as keyof typeof digits];
      result += digit * unit;
      prev = digit;
    } else if (units[char as keyof typeof units] !== undefined) {
      const currentUnit = units[char as keyof typeof units];
      if (prev === 0 && i === chinese.length - 1) {
        unit = currentUnit;
      } else {
        unit = currentUnit;
      }
    }
  }
  
  return result;
};

// 解析章节标题
const parseChapterTitle = (line: string): { chapterNumber: number; title: string } | null => {
  for (const pattern of CHAPTER_PATTERNS) {
    const match = line.match(pattern);
    if (match) {
      const [, chapterNum, chapterTitle] = match;
      let number: number;
      
      if (/^\d+$/.test(chapterNum)) {
        number = parseInt(chapterNum, 10);
      } else {
        number = chineseToArabic(chapterNum);
      }
      
      return {
        chapterNumber: number,
        title: chapterTitle?.trim() || `第${chapterNum}章`,
      };
    }
  }
  return null;
};

// 从文件名提取小说标题和作者
const extractMetadataFromFilename = (filename: string): { title: string; author: string } => {
  // 移除文件扩展名
  const nameWithoutExt = filename.replace(/\.txt$/i, '');
  
  // 尝试匹配 "书名 - 作者" 格式
  const metadataMatch = nameWithoutExt.match(/^(.+?)\s*-\s*(.+)$/);
  if (metadataMatch) {
    return {
      title: metadataMatch[1].trim(),
      author: metadataMatch[2].trim(),
    };
  }
  
  // 默认返回文件名作为标题
  return {
    title: nameWithoutExt.trim(),
    author: '未知作者',
  };
};

// 解析 TXT 小说内容
export const parseTxtNovel = (content: string, filename: string): ParsedNovel => {
  const lines = content.split('\n');
  const metadata = extractMetadataFromFilename(filename);
  const chapters: Array<Omit<Chapter, 'id' | 'novelId'>> = [];
  
  let currentChapter: { chapterNumber: number; title: string; content: string } = {
    chapterNumber: 0,
    title: '',
    content: '',
  };
  let prefaceContent = '';
  let chapterNumberCounter = 0;
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // 跳过空行
    if (!trimmedLine) return;
    
    // 尝试解析章节标题
    const chapterMatch = parseChapterTitle(trimmedLine);
    
    if (chapterMatch) {
      // 如果已经有当前章节，保存它
      if (currentChapter) {
        chapters.push({
          ...currentChapter,
          wordCount: currentChapter.content.length,
        });
      }
      
      // 创建新章节
      currentChapter = {
        chapterNumber: chapterMatch.chapterNumber || ++chapterNumberCounter,
        title: chapterMatch.title,
        content: '',
      };
    } else if (currentChapter) {
      // 添加内容到当前章节
      currentChapter.content += line + '\n';
    } else {
      // 添加到前言
      prefaceContent += line + '\n';
    }
  });
  
  // 添加最后一个章节
  if (currentChapter) {
    chapters.push({
      ...(currentChapter || {}),
      wordCount: (currentChapter?.content || '').length,
    });
  }
  
  // 如果没有解析到章节，创建一个包含所有内容的章节
  if (chapters.length === 0) {
    chapters.push({
      chapterNumber: 1,
      title: '全文',
      content: content,
      wordCount: content.length,
    });
  }
  
  return {
    novel: {
      title: metadata.title,
      author: metadata.author,
      totalChapters: chapters.length,
    },
    chapters,
  };
};

// 读取文件内容
export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsText(file, 'utf-8');
  });
};

// 分块读取大文件（用于进度显示）
export const readFileInChunks = (
  file: File,
  onChunkRead: (chunk: string, progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunkSize = 1024 * 1024; // 1MB 块
    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let content = '';
    
    const reader = new FileReader();
    
    const readNextChunk = () => {
      const start = currentChunk * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const slice = file.slice(start, end);
      
      reader.readAsText(slice, 'utf-8');
    };
    
    reader.onload = (event) => {
      const chunkContent = event.target?.result as string;
      content += chunkContent;
      currentChunk++;
      
      const progress = (currentChunk / totalChunks) * 100;
      onChunkRead(chunkContent, progress);
      
      if (currentChunk < totalChunks) {
        readNextChunk();
      } else {
        resolve(content);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    readNextChunk();
  });
};