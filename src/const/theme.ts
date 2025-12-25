import { ReadingSettings } from "@/types";
import { DEFAULT_FONT_SIZE, DEFAULT_LINE_SPACING } from "./common";

interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  name: string;
  key: string
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
  { name: "明亮", key: "light", backgroundColor: "#f5f5f5", textColor: "#333333" },
  { name: "黑暗", key: "dark", backgroundColor: "#121212", textColor: "#e0e0e0" },
  { name: "米黄", key: "sepia", backgroundColor: "#f4ecd8", textColor: "#5b4636" },
  { name: "纸张", key: "paper", backgroundColor: "#F5F1E6", textColor: "#2E2E2E" },
  { name: "纯白", key: "cleanWhite", backgroundColor: "#FFFFFF", textColor: "#222222" },
  { name: "Kindle 米黄", key: "kindleSepia", backgroundColor: "#F0E3C6", textColor: "#333333" },
  { name: "夜蓝", key: "nightBlue", backgroundColor: "#0F172A", textColor: "#E2E8F0" },
  { name: "森林薄荷", key: "forestMint", backgroundColor: "#F1F7F3", textColor: "#283328" },
  { name: "软灰", key: "softGray", backgroundColor: "#F4F4F4", textColor: "#1F1F1F" },
  { name: "明亮+", key: "solarizedLight", backgroundColor: "#FDF6E3", textColor: "#657B83" },
  { name: "黑暗+", key: "solarizedDark", backgroundColor: "#002B36", textColor: "#839496" },
  { name: "拿铁", key: "latte", backgroundColor: "#FFF1E6", textColor: "#3A2E2A" },
  { name: "摩卡", key: "mocha", backgroundColor: "#3B322C", textColor: "#E8DCC9" },
];

// 主题列表
const THEME_LIST: Array<ReadingSettings['theme']> = THEME_CONFIGS.map(config => config.key);

// 默认阅读设置
const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: DEFAULT_FONT_SIZE,
  fontFamily: 'LXGW WenKai, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  lineSpacing: DEFAULT_LINE_SPACING,
  backgroundColor: THEME_CONFIGS[0].backgroundColor,
  textColor: THEME_CONFIGS[0].textColor,
  theme: 'light',
  readingMode: 'scroll',
};

export { DEFAULT_SETTINGS, THEME_CONFIGS, THEME_LIST };