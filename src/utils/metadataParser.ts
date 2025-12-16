// 从文件名提取小说标题和作者
export const extractMetadataFromFilename = (filename: string): { title: string; author: string } => {
  // 移除文件扩展名
  const nameWithoutExt = filename.replace(/\.txt$/i, '');
  
  // 尝试匹配 "《书名》作者：作者名" 格式
  const authorFormatMatch = nameWithoutExt.match(/^《(.+?)》\s*作者[:：]\s*(.+)$/);
  if (authorFormatMatch) {
    return {
      title: authorFormatMatch[1].trim(),
      author: authorFormatMatch[2].trim(),
    };
  }
  
  // 尝试匹配 "《书名》- 作者名" 格式
  const bookFormatMatch = nameWithoutExt.match(/^《(.+?)》\s*-\s*(.+)$/);
  if (bookFormatMatch) {
    return {
      title: bookFormatMatch[1].trim(),
      author: bookFormatMatch[2].trim(),
    };
  }
  
  // 尝试匹配 "书名 - 作者" 格式
  const metadataMatch = nameWithoutExt.match(/^(.+?)\s*-\s*(.+)$/);
  if (metadataMatch) {
    // 如果标题包含书名号，提取内容
    const titleMatch = metadataMatch[1].match(/^《(.+?)》$/);
    return {
      title: titleMatch ? titleMatch[1].trim() : metadataMatch[1].trim(),
      author: metadataMatch[2].trim(),
    };
  }
  
  // 尝试匹配单独的书名号格式
  const singleBookMatch = nameWithoutExt.match(/^《(.+?)》$/);
  if (singleBookMatch) {
    return {
      title: singleBookMatch[1].trim(),
      author: '未知作者',
    };
  }
  
  // 默认返回文件名作为标题
  return {
    title: nameWithoutExt.trim(),
    author: '未知作者',
  };
};
