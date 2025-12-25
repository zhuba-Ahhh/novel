import { createContext, useState, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { ReadingSettings } from '../types';
import { MAX_FONT_SIZE, MAX_LINE_SPACING, MIN_FONT_SIZE, MIN_LINE_SPACING, READING_SETTINGS_KEY } from '@/const';
import { DEFAULT_SETTINGS, THEME_CONFIGS } from '@/const/theme';


// 阅读上下文类型
interface ReadingContextType {
  settings: ReadingSettings;
  updateSettings: (newSettings: Partial<ReadingSettings>) => void;
  toggleTheme: (themeKey: string) => void;
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

  useEffect(() => {
    localStorage.setItem(READING_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // 更新设置
  const updateSettings = useCallback((newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // 切换主题
  const toggleTheme = useCallback((themeKey: string) => {
    const themeConfig = THEME_CONFIGS.find(config => config.key === themeKey);
    if (themeConfig) {
      updateSettings({
        theme: themeKey,
        backgroundColor: themeConfig.backgroundColor,
        textColor: themeConfig.textColor,
      });
    }
  }, [updateSettings]);

  // 调整字体大小的通用函数
  const adjustFontSize = useCallback((delta: number) => {
    setSettings(prev => {
      const newSize = Math.max(MIN_FONT_SIZE, Math.min(prev.fontSize + delta, MAX_FONT_SIZE));
      return { ...prev, fontSize: newSize };
    });
  }, []);

  // 调整行高的通用函数
  const adjustLineSpacing = useCallback((delta: number) => {
    setSettings(prev => {
      const newSpacing = Math.max(MIN_LINE_SPACING, Math.min(prev.lineSpacing + delta, MAX_LINE_SPACING));
      return { ...prev, lineSpacing: Number(newSpacing.toFixed(2)) };
    });
  }, []);

  // 字体大小调整函数
  const increaseFontSize = useCallback(() => adjustFontSize(2), [adjustFontSize]);
  const decreaseFontSize = useCallback(() => adjustFontSize(-2), [adjustFontSize]);

  // 行高调整函数
  const increaseLineSpacing = useCallback(() => adjustLineSpacing(2), [adjustLineSpacing]);
  const decreaseLineSpacing = useCallback(() => adjustLineSpacing(-2), [adjustLineSpacing]);

  // 提供给上下文的值
  const value = useMemo(() => ({
    settings,
    updateSettings,
    toggleTheme,
    increaseFontSize,
    decreaseFontSize,
    increaseLineSpacing,
    decreaseLineSpacing,
  }), [settings, updateSettings, toggleTheme, increaseFontSize, decreaseFontSize, increaseLineSpacing, decreaseLineSpacing]);

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
};

// 自定义 Hook 用于访问阅读上下文
export const useReadingContext = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReadingContext must be used within a ReadingProvider');
  }
  return context;
};