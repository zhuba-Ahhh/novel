import { Popup } from "tdesign-mobile-react";
import styles from './index.module.less';
import { useReadingContext } from "@/contexts/ReadingContext";
import { MAX_FONT_SIZE, MAX_LINE_SPACING, MIN_FONT_SIZE, MIN_LINE_SPACING } from "@/const";

interface SettingButtonProps {
  isScrolling: boolean;
  showSettingsPanel: boolean;
  setShowSettingsPanel: (show: boolean) => void;
}

const ReaderSetting = ({ isScrolling, showSettingsPanel, setShowSettingsPanel }: SettingButtonProps) => {
  const { settings, increaseFontSize, decreaseFontSize, toggleTheme, increaseLineSpacing, decreaseLineSpacing } = useReadingContext();

  return (
    <>
      {
        !isScrolling &&
        <div
          className={styles['settings-button']}
          onClick={() => setShowSettingsPanel(!showSettingsPanel)}
        >
          设置
        </div>
      }
      <Popup
        visible={showSettingsPanel}
        placement="bottom"
        showOverlay={false}
        preventScrollThrough={false}
      >
        <div className={styles['settings-container']}>
          <div className={styles['settings-header']}>
            <h3>阅读设置</h3>
            <button
              className={styles['close-button']}
              onClick={() => setShowSettingsPanel(false)}
            >
              ×
            </button>
          </div>

          <div className={styles['settings-content']}>
            <div className={styles['setting-section']}>
              {/* 字体大小设置 */}
              <div className={styles['setting-section-item']}>
                <div>
                <h4>字体大小</h4>
                <div className={styles['font-size-controls']}>
                  <button
                    className={styles['control-button']}
                    onClick={decreaseFontSize}
                    disabled={settings.fontSize === MIN_FONT_SIZE}
                  >
                    A-
                  </button>
                  <span className={styles['font-size-display']}>{settings.fontSize}px</span>
                  <button
                    className={styles['control-button']}
                    onClick={increaseFontSize}
                    disabled={settings.fontSize === MAX_FONT_SIZE}
                  >
                    A+
                  </button>
                </div>
              </div>

              <div>
                <h4>行高</h4>
                <div className={styles['line-spacing-controls']}>
                  <button
                    className={styles['control-button']}
                    onClick={decreaseLineSpacing}
                    disabled={settings.lineSpacing === MIN_LINE_SPACING}
                  >
                    A-
                  </button>
                  <span className={styles['line-spacing-display']}>{settings.lineSpacing}px</span>
                  <button
                    className={styles['control-button']}
                    onClick={increaseLineSpacing}
                    disabled={settings.lineSpacing === MAX_LINE_SPACING}
                  >
                    A+
                  </button>
                </div>
              </div>
              </div>
            </div>

            {/* 主题设置 */}
            <div className={styles['setting-section']}>
              <h4>主题</h4>
              <div className={styles['theme-controls']}>
                <button
                  className={`${styles['theme-button']} ${settings.theme === 'light' ? styles['active'] : ''}`}
                  onClick={toggleTheme}
                >
                  浅色
                </button>
                <button
                  className={`${styles['theme-button']} ${settings.theme === 'dark' ? styles['active'] : ''}`}
                  onClick={toggleTheme}
                >
                  深色
                </button>
                <button
                  className={`${styles['theme-button']} ${settings.theme === 'sepia' ? styles['active'] : ''}`}
                  onClick={toggleTheme}
                >
                  护眼
                </button>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </>
  )
}

export { ReaderSetting }