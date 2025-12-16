import { useState, useRef, ChangeEvent } from 'react';
import { Button, Progress, Toast } from 'tdesign-mobile-react';
import styles from './FileUploader.module.less';
import { UploadStatus, ParsedNovel } from '../types';
import { parseTxtNovel, readFileContent } from '../utils';
import { endsWith } from 'lodash-es';

interface FileUploaderProps {
  onNovelParsed: (parsedNovel: ParsedNovel) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onNovelParsed }) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ isUploading: false, progress: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;  

    // 验证文件类型和大小
    if (!endsWith(file.name.toLowerCase(), '.txt')) {
      Toast.error({ message: '请上传 TXT 格式的小说文件' });
      return setUploadStatus({ isUploading: false, progress: 0 });
    }
    if (file.size > 100 * 1024 * 1024) {
      Toast.error({ message: '文件大小不能超过 100MB' });
      return setUploadStatus({ isUploading: false, progress: 0 });
    }

    try {
      setUploadStatus({ isUploading: true, progress: 10 });
      const content = await readFileContent(file);
      setUploadStatus({ isUploading: true, progress: 50 });
      const parsedNovel = parseTxtNovel(content, file.name);
      setUploadStatus({ isUploading: true, progress: 100 });
      onNovelParsed(parsedNovel);
      setTimeout(() => {
        setUploadStatus({ isUploading: false, progress: 0 });
        Toast.success({ message: '小说上传成功！' });
      }, 500);
    } catch (error) {
      setUploadStatus({ isUploading: false, progress: 0 });
      Toast.error({
        message: error instanceof Error ? error.message : '文件解析失败'
      });
    }
  };

  return (
    <div className={styles['file-uploader']}>
      <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileSelect} className={styles['file-input']} disabled={uploadStatus.isUploading} />
      <div className={styles['upload-container']}>
        <Button
          size="large"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadStatus.isUploading}
          style={{ padding: '12px 32px', fontSize: '16px' }}
        >
          {uploadStatus.isUploading ? '上传中...' : '上传'}
        </Button>
        {uploadStatus.isUploading && (
          <div style={{ width: '100%' }}>
            <Progress percentage={Math.round(uploadStatus.progress)} size="large" />
          </div>
        )}
        {uploadStatus.error && <div className={styles['error-message']}>{uploadStatus.error}</div>}
        {uploadStatus.success && <div className={styles['success-message']}>小说上传成功！</div>}
      </div>
    </div>
  );
};

export default FileUploader;