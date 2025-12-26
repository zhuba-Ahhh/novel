import {
  ReadingModeEnum,
  ReadingSettings,
} from '@/types';

import {
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_SPACING,
} from './common';

interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  name: string;
  key: string
  description: string
}
// 主题配置映射
// const THEME_CONFIGS: ThemeConfig[] = [
//   { name: "默认", key: "light", backgroundColor: "#f5f5f5", textColor: "#333333" },
//   { name: "白雪", key: "snow", backgroundColor: "#ffffff", textColor: "#000000" },
//   { name: "灰绿", key: "gray-green", backgroundColor: "#d8e7eb", textColor: "#000000" },
//   { name: "浅蓝", key: "light-blue", backgroundColor: "#e9faff", textColor: "#000000" },
//   { name: "明黄", key: "light-yellow", backgroundColor: "#ffffed", textColor: "#000000" },
//   { name: "淡绿", key: "light-green", backgroundColor: "#eefaee", textColor: "#000000" },
//   { name: "草绿", key: "green", backgroundColor: "#cce8cf", textColor: "#000000" },
//   { name: "红粉", key: "red-pink", backgroundColor: "#fcefff", textColor: "#000000" },
//   { name: "水墨", key: "ink", backgroundColor: "#c0d3d7", textColor: "#111111" },
//   { name: "米黄", key: "mint-yellow", backgroundColor: "#f5f5dc", textColor: "#000000" },
//   { name: "茶色", key: "brown", backgroundColor: "#d2b48c", textColor: "#000000" },
//   { name: "银色", key: "silver", backgroundColor: "#c0c0c0", textColor: "#000000" },
//   { name: "黑绿", key: "dark-green", backgroundColor: "#000000", textColor: "#00b800" },
//   { name: "浅黄", key: "pale-yellow", backgroundColor: "#f5f1e8", textColor: "#000000" },
//   { name: "午夜", key: "midnight", backgroundColor: "#002b36", textColor: "#839496" },
//   { name: "浅灰", key: "light-gray", backgroundColor: "#d9e0e8", textColor: "#000000" },
//   { name: "漆黑", key: "dark-black", backgroundColor: "#000000", textColor: "#555555" }
// ];

const THEME_CONFIGS: ThemeConfig[] = [
  { name: "明亮", key: "light", backgroundColor: "#f5f5f5", textColor: "#333333", description: "略微偏灰的浅色背景，舒适耐看。" },
  { name: "黑暗", key: "dark", backgroundColor: "#121212", textColor: "#e0e0e0", description: "高对比度暗色主题，适合完全黑暗环境。" },
  { name: "米黄", key: "sepia", backgroundColor: "#f4ecd8", textColor: "#5b4636", description: "偏棕黄的纸张颜色，复古阅读感。" },
  { name: "纸张", key: "paper", backgroundColor: "#F5F1E6", textColor: "#2E2E2E", description: "略偏米色的纸张背景，适合白天长时间阅读。" },
  { name: "纯白", key: "cleanWhite", backgroundColor: "#FFFFFF", textColor: "#222222", description: "高对比度白底黑字，适合光线充足环境。" },
  { name: "Kindle 米黄", key: "kindleSepia", backgroundColor: "#F0E3C6", textColor: "#333333", description: "柔和棕色调，接近电子书阅读器效果。" },
  { name: "夜蓝", key: "nightBlue", backgroundColor: "#0F172A", textColor: "#E2E8F0", description: "深蓝底浅字，夜间阅读更沉浸。" },
  { name: "森林薄荷", key: "forestMint", backgroundColor: "#F1F7F3", textColor: "#283328", description: "带一点绿色的纸张质感，适合久读。" },
  { name: "软灰", key: "softGray", backgroundColor: "#F4F4F4", textColor: "#1F1F1F", description: "低饱和灰色基调，偏专业阅读氛围。" },
  { name: "明亮+", key: "solarizedLight", backgroundColor: "#FDF6E3", textColor: "#657B83", description: "经典 Solarized 配色，适合对色彩敏感的用户。" },
  { name: "黑暗+", key: "solarizedDark", backgroundColor: "#002B36", textColor: "#839496", description: "偏青绿的深色背景，文字柔和不刺眼。" },
  { name: "拿铁", key: "latte", backgroundColor: "#FFF1E6", textColor: "#3A2E2A", description: "柔和奶咖色背景，适合轻松阅读。" },
  { name: "摩卡", key: "mocha", backgroundColor: "#3B322C", textColor: "#E8DCC9", description: "深咖色背景搭配浅字，营造温暖夜读感。" },
];

// 主题列表
const THEME_LIST: Array<ReadingSettings['theme']> = THEME_CONFIGS.map(config => config.key);

export type FontKey =
  | 'notoSansSc'
  | 'notoSerifSc'
  | 'pingFangSc'
  | 'microsoftYaHei'
  | 'lxgwWenKai'
  | 'sourceHanSans'
  | 'sourceHanSerif'
  | 'inter'
  | 'roboto'
  | 'georgia'
  | 'timesNewRoman'
  | 'sfProText'
  | 'systemUi';

export interface FontOption {
  key: FontKey;
  label: string;
  description: string;
  fontFamily: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    key: 'lxgwWenKai',
    label: '霞鹜文楷 LXGW WenKai',
    description: '开源手写风格中文字体，字形优雅，适合长时间阅读。',
    fontFamily:
      '"LXGW WenKai Lite", system-ui, "PingFang SC", "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  {
    key: 'notoSansSc',
    label: 'Noto Sans SC 无衬线',
    description: '通用阅读无衬线字体，兼顾中英文阅读体验。',
    fontFamily:
      '"Noto Sans SC", "PingFang SC", -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, "Segoe UI", sans-serif',
  },
  {
    key: 'notoSerifSc',
    label: 'Noto Serif SC 书籍宋体',
    description: '适合长篇小说的书籍感宋体风格。',
    fontFamily:
      '"Noto Serif SC", "Songti SC", "STSong", "SimSun", "Times New Roman", "Georgia", serif',
  },
  {
    key: 'pingFangSc',
    label: '苹方 PingFang SC',
    description: 'macOS 系统默认中文无衬线字体，现代感较强。',
    fontFamily:
      '"PingFang SC", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, "Segoe UI", sans-serif',
  },
  {
    key: 'microsoftYaHei',
    label: '微软雅黑 Microsoft YaHei',
    description: 'Windows 平台常见中文无衬线字体，适合跨平台浏览。',
    fontFamily:
      '"Microsoft YaHei", "Segoe UI", "Noto Sans SC", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  {
    key: 'sourceHanSans',
    label: '思源黑体 Source Han Sans',
    description: '跨平台开源黑体，适合界面与阅读混合场景。',
    fontFamily:
      '"Source Han Sans SC", "Noto Sans SC", "PingFang SC", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  {
    key: 'sourceHanSerif',
    label: '思源宋体 Source Han Serif',
    description: '更传统的宋体阅读体验，适合文学类文本。',
    fontFamily:
      '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',
  },
  {
    key: 'inter',
    label: 'Inter 英文优先',
    description: '适合中英混排，英文部分清晰现代。',
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Noto Sans SC", sans-serif',
  },
  {
    key: 'roboto',
    label: 'Roboto 整洁无衬线',
    description: 'Google 常用无衬线字体，适合界面与长文阅读。',
    fontFamily:
      'Roboto, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Noto Sans SC", sans-serif',
  },
  {
    key: 'georgia',
    label: 'Georgia 经典衬线',
    description: '偏英文书籍风格的经典衬线字体。',
    fontFamily:
      'Georgia, "Times New Roman", "Noto Serif SC", serif',
  },
  {
    key: 'timesNewRoman',
    label: 'Times New Roman 传统印刷',
    description: '更传统的印刷风格，适合偏正式内容。',
    fontFamily:
      '"Times New Roman", Georgia, "Noto Serif SC", serif',
  },
  {
    key: 'sfProText',
    label: 'SF Pro Text 系统无衬线',
    description: 'Apple 平台常用系统字体，界面和阅读都比较舒适。',
    fontFamily:
      '"SF Pro Text", -apple-system, BlinkMacSystemFont, "PingFang SC", system-ui, "Noto Sans SC", sans-serif',
  },
  {
    key: 'systemUi',
    label: '系统默认无衬线',
    description: '统一使用系统默认 UI 字体，保证各平台一致性。',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif',
  },
]

export const DEFAULT_FONT_KEY: FontKey = 'lxgwWenKai'

export const getFontFamilyByKey = (key: FontKey): string => {
  const fontOption = FONT_OPTIONS.find((item) => item.key === key)

  if (!fontOption) {
    return FONT_OPTIONS[0].fontFamily
  }

  return fontOption.fontFamily
}

// 默认阅读设置
const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: DEFAULT_FONT_SIZE,
  fontFamily: getFontFamilyByKey(DEFAULT_FONT_KEY),
  lineSpacing: DEFAULT_LINE_SPACING,
  backgroundColor: THEME_CONFIGS[0].backgroundColor,
  textColor: THEME_CONFIGS[0].textColor,
  theme: 'light',
  readingMode: ReadingModeEnum.Scroll,
};

export { DEFAULT_SETTINGS, THEME_CONFIGS, THEME_LIST };