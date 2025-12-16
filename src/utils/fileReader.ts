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
