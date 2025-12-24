import { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { ReadingSettings } from '../types';
import { DEFAULT_FONT_SIZE, DEFAULT_LINE_SPACING, MAX_FONT_SIZE, MAX_LINE_SPACING, MIN_FONT_SIZE, MIN_LINE_SPACING, READING_SETTINGS_KEY } from '@/const';

// 默认阅读设置
const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: DEFAULT_FONT_SIZE,
  fontFamily: 'LXGW WenKai, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  lineSpacing: DEFAULT_LINE_SPACING,
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
  increaseLineSpacing: () => void;
  decreaseLineSpacing: () => void;
}

// 创建上下文
const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

// 上下文提供者组件
interface ReadingProviderProps {
  children: ReactNode;
}

export const ReadingProvider: React.FC<ReadingProviderProps> = ({ children }) => {
  const savedSettings = localStorage.getItem(READING_SETTINGS_KEY);
  const initialSettings = savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  const [settings, setSettings] = useState<ReadingSettings>(initialSettings);

  // 更新设置
  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => {
      const temp = ({ ...prev, ...newSettings })
      localStorage.setItem(READING_SETTINGS_KEY, JSON.stringify(temp));
      return temp;
    });
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

      const temp = ({ ...prev, theme: newTheme, backgroundColor, textColor });
      localStorage.setItem(READING_SETTINGS_KEY, JSON.stringify(temp));
      return temp;
    });
  };

  // 增大字体大小
  const increaseFontSize = () => {
    updateSettings({ fontSize: Math.min(settings.fontSize + 2, MAX_FONT_SIZE) });
  };

  // 减小字体大小
  const decreaseFontSize = () => {
    updateSettings({ fontSize: Math.max(settings.fontSize - 2, MIN_FONT_SIZE) });
  };

  // 行高
  const increaseLineSpacing = () => {
    updateSettings({ lineSpacing: Number(Math.min(settings.lineSpacing + 2, MAX_LINE_SPACING).toFixed(2)) });
  };

  // 减小行高
  const decreaseLineSpacing = () => {
    updateSettings({ lineSpacing: Number(Math.max(settings.lineSpacing - 2, MIN_LINE_SPACING).toFixed(2)) });
  };

  const value = useMemo(() => ({
    settings,
    updateSettings,
    toggleTheme,
    increaseFontSize,
    decreaseFontSize,
    increaseLineSpacing,
    decreaseLineSpacing,
  }), [settings]);

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
};

// 自定义 Hook 用于访问阅读上下文

export const useReadingContext = () => {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error('useReadingContext must be used within a ReadingProvider');
  }
  return context;
};