import { ParsedNovel, Chapter } from '../types';
import { extractMetadataFromFilename } from './metadataParser';

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
  let temp = 0;
  
  for (let i = chinese.length - 1; i >= 0; i--) {
    const char = chinese[i];
    
    if (digits[char as keyof typeof digits] !== undefined) {
      const digit = digits[char as keyof typeof digits];
      temp += digit * unit;
      unit *= 10;
    } else if (units[char as keyof typeof units] !== undefined) {
      const currentUnit = units[char as keyof typeof units];
      if (temp === 0) {
        temp = 1 * currentUnit;
      } else {
        temp *= currentUnit;
      }
      unit = 10;
      result += temp;
      temp = 0;
    }
  }
  
  result += temp;
  return result || 0;
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
  let chapterNumberCounter = 0;
  const usedChapterNumbers = new Set<number>();
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // 跳过空行
    if (!trimmedLine) return;
    
    // 尝试解析章节标题
    const chapterMatch = parseChapterTitle(trimmedLine);
    
    if (chapterMatch) {
      // 如果已经有当前章节，保存它
      if (!(currentChapter.chapterNumber === 0 && currentChapter.title === '' && currentChapter.content === '')) {
        // 确保当前章节号唯一
        while (usedChapterNumbers.has(currentChapter.chapterNumber)) {
          currentChapter.chapterNumber = ++chapterNumberCounter;
        }
        usedChapterNumbers.add(currentChapter.chapterNumber);
        
        chapters.push({
          ...currentChapter,
          wordCount: currentChapter.content.length,
        });
      }
      
      // 创建新章节，确保章节号唯一
      let newChapterNumber = chapterMatch.chapterNumber > 0 ? chapterMatch.chapterNumber : ++chapterNumberCounter;
      while (usedChapterNumbers.has(newChapterNumber)) {
        newChapterNumber = ++chapterNumberCounter;
      }
      
      currentChapter = {
        chapterNumber: newChapterNumber,
        title: chapterMatch.title,
        content: '',
      };
    } else {
      // 添加内容到当前章节
      currentChapter.content += line + '\n';
    }
  });
  
  // 添加最后一个章节
  if (!(currentChapter.chapterNumber === 0 && currentChapter.title === '' && currentChapter.content === '')) {
    // 确保最后一个章节号唯一
    while (usedChapterNumbers.has(currentChapter.chapterNumber)) {
      currentChapter.chapterNumber = ++chapterNumberCounter;
    }
    usedChapterNumbers.add(currentChapter.chapterNumber);
    
    chapters.push({
      ...currentChapter,
      wordCount: currentChapter.content.length,
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
