import { ParsedNovel, Chapter } from '../types';
import { extractMetadataFromFilename } from './metadataParser';
import {zhToNumber} from 'zh-to-number';

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
export const chineseToArabic = (chinese: string): number => {  
  return Number(zhToNumber(chinese)) || 0;
};

// 解析章节标题
export const parseChapterTitle = (line: string): { chapterNumber: number; title: string, originalTitle: string } | null => {
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
        originalTitle: chapterNum + (chapterTitle?.trim() || ''),
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
  
  let currentChapter: { chapterNumber: number; title: string; originalTitle: string; content: string } = {
    chapterNumber: 0,
    title: '',
    originalTitle: '',
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
        originalTitle: chapterMatch.originalTitle,
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
      originalTitle: '全文',
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
