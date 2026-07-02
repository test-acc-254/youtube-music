import { createPlugin } from '@/utils';
import { t } from '@/i18n';
import { default as globalAppConfig } from '@/config';

import darkThemeStyles from './dark-theme.css?inline';

const STYLE_ID = 'dark-mode-styles';

function addStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = darkThemeStyles;
  document.head.append(style);
}

function removeStyles() {
  const style = document.getElementById(STYLE_ID);
  if (style) {
    style.remove();
  }
}

export default createPlugin({
  name: () => t('plugins.dark-mode.name'),
  description: () => t('plugins.dark-mode.description'),
  restartNeeded: false,
  config: {
    enabled: false, // Default state
  },
  stylesheets: [], // Let renderer handle it for dynamic toggling
  renderer: {
    async start({ getConfig }) {
      const pluginConfig = await getConfig();
      if (pluginConfig.enabled) {
        addStyles();
        if (globalAppConfig.plugins.isEnabled('album-color-theme')) {
          console.log('Dark Mode enabled, disabling Album Color Theme.');
          globalAppConfig.plugins.disable('album-color-theme');
        }
      } else {
        removeStyles();
      }
    },
    async onConfigChange(pluginConfig) {
      if (pluginConfig.enabled) {
        addStyles();
        if (globalAppConfig.plugins.isEnabled('album-color-theme')) {
          console.log('Dark Mode enabled, disabling Album Color Theme.');
          globalAppConfig.plugins.disable('album-color-theme');
        }
      } else {
        removeStyles();
      }
    },
  },
});
