import {
  Popover,
  Popup,
} from 'tdesign-mobile-react';

import {
  MAX_FONT_SIZE,
  MAX_LINE_SPACING,
  MIN_FONT_SIZE,
  MIN_LINE_SPACING,
} from '@/const';
import {
  FONT_OPTIONS,
  THEME_CONFIGS,
} from '@/const/theme';
import { useReadingContext } from '@/contexts/ReadingContext';

import styles from './index.module.less';

interface SettingButtonProps {
  isScrolling: boolean;
  showSettingsPanel: boolean;
  setShowSettingsPanel: (show: boolean) => void;
}

interface SettingControlProps {
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

const SettingControl = ({ label, value, minValue, maxValue, onDecrease, onIncrease }: SettingControlProps) => {
  return (
    <div className={styles['setting-item']}>
      <h4>{label}</h4>
      <div className={styles['setting-controls']}>
        <button
          className={styles['control-button']}
          onClick={onDecrease}
          disabled={value === minValue}
        >
          A-
        </button>
        <span className={styles['control-display']}>{value}px</span>
        <button
          className={styles['control-button']}
          onClick={onIncrease}
          disabled={value === maxValue}
        >
          A+
        </button>
      </div>
    </div>
  );
};

const ReaderSetting = ({ isScrolling, showSettingsPanel, setShowSettingsPanel }: SettingButtonProps) => {
  const { settings, increaseFontSize, decreaseFontSize, toggleTheme, toggleFont, increaseLineSpacing, decreaseLineSpacing } = useReadingContext();

  return (
    <>
      {!isScrolling && (
        <div className={styles['settings-button']} onClick={() => setShowSettingsPanel(!showSettingsPanel)}>
          设置
        </div>
      )}
      <Popup
        visible={showSettingsPanel}
        placement="bottom"
        showOverlay={false}
        preventScrollThrough={false}
      >
        <div className={styles['settings-container']}>
          <div className={styles['settings-header']}>
            <h3>阅读设置</h3>
            <button className={styles['close-button']} onClick={() => setShowSettingsPanel(false)}>
              ×
            </button>
          </div>

          <div className={styles['settings-content']}>
            {/* 字体大小和行高设置 */}
            <div className={styles['setting-section']}>
              <div className={styles['setting-row']}>
                <SettingControl
                  label="字体大小"
                  value={settings.fontSize}
                  minValue={MIN_FONT_SIZE}
                  maxValue={MAX_FONT_SIZE}
                  onDecrease={decreaseFontSize}
                  onIncrease={increaseFontSize}
                />
                <SettingControl
                  label="行高"
                  value={settings.lineSpacing}
                  minValue={MIN_LINE_SPACING}
                  maxValue={MAX_LINE_SPACING}
                  onDecrease={decreaseLineSpacing}
                  onIncrease={increaseLineSpacing}
                />
              </div>
            </div>

            {/* 主题设置 */}
            <div className={styles['setting-section']}>
              <h4>主题</h4>
              <div className={styles['setting-options']}>
                {THEME_CONFIGS.map((theme) => (
                  <Popover key={theme.key} theme="dark" content={theme.description} triggerElement={
                    <button
                      className={`${styles['option-button']} ${settings.theme === theme.key ? styles['active'] : ''}`}
                      onClick={() => toggleTheme(theme.key)}
                      style={{
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                        border: `1px solid ${theme.textColor}`,
                      }}
                    >
                      {theme.name}
                    </button>
                  }></Popover>
                ))}
              </div>
            </div>

            {/* 字体设置 */}
            <div className={styles['setting-section']}>
              <h4>字体</h4>
              <div className={styles['setting-options']}>
                {FONT_OPTIONS.map((font) => (
                  <Popover key={font.key} theme="dark" content={font.description} triggerElement={
                    <button
                      className={`${styles['option-button']} ${settings.fontFamily === font.fontFamily ? styles['active'] : ''}`}
                      onClick={() => toggleFont(font.key)}
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.label}
                    </button>
                  }></Popover>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </>
  )
}

export { ReaderSetting };