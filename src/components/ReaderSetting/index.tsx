import { Popup, Popover } from "tdesign-mobile-react";
import styles from './index.module.less';
import { useReadingContext } from "@/contexts/ReadingContext";
import { MAX_FONT_SIZE, MAX_LINE_SPACING, MIN_FONT_SIZE, MIN_LINE_SPACING } from "@/const";
import { THEME_CONFIGS, FONT_OPTIONS } from "@/const/theme";

interface SettingButtonProps {
  isScrolling: boolean;
  showSettingsPanel: boolean;
  setShowSettingsPanel: (show: boolean) => void;
}

const ReaderSetting = ({ isScrolling, showSettingsPanel, setShowSettingsPanel }: SettingButtonProps) => {
  const { settings, increaseFontSize, decreaseFontSize, toggleTheme, toggleFont, increaseLineSpacing, decreaseLineSpacing } = useReadingContext();

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
          <div className={styles['settings-container__header']}>
            <h3>阅读设置</h3>
            <button
              className={styles['settings-container__header__close-button']}
              onClick={() => setShowSettingsPanel(false)}
            >
              ×
            </button>
          </div>

          <div className={styles['settings-container__content']}>
            <div className={styles['setting-section']}>
              {/* 字体大小设置 */}
              <div className={styles['setting-section__item']}>
                <div>
                  <h4>字体大小</h4>
                  <div className={styles['setting-section__font-size-controls']}>
                    <button
                      className={styles['control-button']}
                      onClick={decreaseFontSize}
                      disabled={settings.fontSize === MIN_FONT_SIZE}
                    >
                      A-
                    </button>
                    <span className={styles['setting-section__font-size-controls__font-size-display']}>{settings.fontSize}px</span>
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
                  <div className={styles['setting-section__line-spacing-controls']}>
                    <button
                      className={styles['control-button']}
                      onClick={decreaseLineSpacing}
                      disabled={settings.lineSpacing === MIN_LINE_SPACING}
                    >
                      A-
                    </button>
                    <span>{settings.lineSpacing}px</span>
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
              <div className={styles['setting-section__theme-controls']}>
                {THEME_CONFIGS.map((theme) => (
                  <Popover
                    theme="dark"
                    content={theme.description}
                    triggerElement={
                      <button
                        key={theme.key}
                        className={`${styles['setting-section__theme-controls__theme-button']} ${settings.theme === theme.key ? styles['active'] : ''}`}
                        onClick={() => toggleTheme(theme.key)}
                        style={{
                          backgroundColor: theme.backgroundColor,
                          color: theme.textColor,
                          border: `1px solid ${theme.textColor}`,
                        }}
                      >
                        {theme.name}
                      </button>
                    }
                  ></Popover>

                ))}
              </div>
            </div>

            {/* 字体设置 */}
            <div className={styles['setting-section']}>
              <h4>字体</h4>
              <div className={styles['setting-section__font-controls']}>
                {FONT_OPTIONS.map((font) => (
                  <Popover
                    theme="dark"
                    content={font.description}
                    triggerElement={
                      <button
                        key={font.key}
                        className={`${styles['setting-section__font-controls__font-button']} ${settings.fontFamily === font.fontFamily ? styles['active'] : ''}`}
                        onClick={() => toggleFont(font.key)}
                        style={{
                          fontFamily: font.fontFamily,
                        }}
                      >
                        {font.label}
                      </button>
                    }
                  ></Popover>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </>
  )
}

export { ReaderSetting }