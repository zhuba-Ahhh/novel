import { useState, useRef, ChangeEvent } from 'react';
import styles from './FileUploader.module.less';
import { UploadStatus, ParsedNovel } from '../types';
import { readFileContent, parseTxtNovel } from '../utils/fileParser';

interface FileUploaderProps {
  onNovelParsed: (parsedNovel: ParsedNovel) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onNovelParsed }) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: '请上传 TXT 格式的小说文件',
      });
      return;
    }

    // 验证文件大小（限制 100MB）
    if (file.size > 100 * 1024 * 1024) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: '文件大小不能超过 100MB',
      });
      return;
    }

    try {
      setUploadStatus({
        isUploading: true,
        progress: 10,
      });

      // 读取文件内容
      const content = await readFileContent(file);
      
      setUploadStatus({
        isUploading: true,
        progress: 50,
      });

      // 解析小说
      const parsedNovel = parseTxtNovel(content, file.name);
      
      setUploadStatus({
        isUploading: true,
        progress: 100,
      });

      // 通知父组件
      onNovelParsed(parsedNovel);

      // 重置状态
      setTimeout(() => {
        setUploadStatus({
          isUploading: false,
          progress: 0,
          success: true,
        });
      }, 500);

    } catch (error) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : '文件解析失败',
      });
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles['file-uploader']}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileSelect}
        className={styles['file-input']}
        disabled={uploadStatus.isUploading}
      />

      <div className={styles['upload-container']}>
        <button
          className={styles['upload-button']}
          onClick={handleUploadButtonClick}
          disabled={uploadStatus.isUploading}
        >
          {uploadStatus.isUploading ? '上传中...' : '上传'}
        </button>

        {uploadStatus.isUploading && (
          <div className={styles['progress-bar']}>
            <div
              className={styles['progress-fill']}
              style={{ width: `${uploadStatus.progress}%` }}
            />
            <span className={styles['progress-text']}>
              {Math.round(uploadStatus.progress)}%
            </span>
          </div>
        )}

        {uploadStatus.error && (
          <div className={styles['error-message']}>
            {uploadStatus.error}
          </div>
        )}

        {uploadStatus.success && (
          <div className={styles['success-message']}>
            小说上传成功！
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;