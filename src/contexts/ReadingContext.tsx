import { createContext, useState, useContext, ReactNode } from 'react';
import { ReadingSettings } from '../types';

// 默认阅读设置
const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  lineSpacing: 1.6,
  backgroundColor: '#f5f5f5',
  textColor: '#333333',
  theme: 'light',
  readingMode: 'scroll',
};

// 阅读上下文类型
interface ReadingContextType {
  settings: ReadingSettings;
  updateSettings: (newSettings: Partial<ReadingSettings>) => void;
  toggleTheme: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

// 创建上下文
const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

// 上下文提供者组件
interface ReadingProviderProps {
  children: ReactNode;
}

export const ReadingProvider: React.FC<ReadingProviderProps> = ({ children }) => {
  // 使用默认设置，不使用 localStorage
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);

  // 更新设置
  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // 切换主题
  const toggleTheme = () => {
    setSettings(prev => {
      const themes: Array<ReadingSettings['theme']> = ['light', 'dark', 'sepia'];
      const currentIndex = themes.indexOf(prev.theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      const newTheme = themes[nextIndex];
      
      // 根据主题更新颜色
      let backgroundColor = prev.backgroundColor;
      let textColor = prev.textColor;
      
      switch (newTheme) {
        case 'dark':
          backgroundColor = '#121212';
          textColor = '#e0e0e0';
          break;
        case 'sepia':
          backgroundColor = '#f4ecd8';
          textColor = '#5b4636';
          break;
        case 'light':
        default:
          backgroundColor = '#f5f5f5';
          textColor = '#333333';
          break;
      }
      
      return { ...prev, theme: newTheme, backgroundColor, textColor };
    });
  };

  // 增大字体大小
  const increaseFontSize = () => {
    setSettings(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 2, 36) }));
  };

  // 减小字体大小
  const decreaseFontSize = () => {
    setSettings(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 2, 12) }));
  };

  return (
    <ReadingContext.Provider value={{ settings, updateSettings, toggleTheme, increaseFontSize, decreaseFontSize }}>
      {children}
    </ReadingContext.Provider>
  );
};

// 自定义 Hook 用于访问阅读上下文
// eslint-disable-next-line react-refresh/only-export-components
export const useReadingContext = () => {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error('useReadingContext must be used within a ReadingProvider');
  }
  return context;
};