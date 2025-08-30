import { createPlugin } from '@/utils';

import { t } from '@/i18n';

export type SongTimerPluginConfig = {
  enabled: boolean;
  showCountdown: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity: number;
};

export default createPlugin<
  unknown,
  unknown,
  {
    config: SongTimerPluginConfig | null;
    api: any | null;
    timerElement: HTMLElement | null;
    intervalId: NodeJS.Timeout | null;
    currentDuration: number;
    currentTime: number;
  },
  SongTimerPluginConfig
>({
  name: () => t('plugins.song-timer.name'),
  description: () => t('plugins.song-timer.description'),
  restartNeeded: false,
  config: {
    enabled: false,
    showCountdown: false,
    position: 'top-right',
    opacity: 0.8,
  },
  menu: async ({ getConfig, setConfig }) => {
    const config = await getConfig();

    return [
      {
        label: 'Show countdown instead of elapsed time',
        type: 'checkbox',
        checked: config.showCountdown,
        async click() {
          const currentConfig = await getConfig();
          setConfig({
            showCountdown: !currentConfig.showCountdown,
          });
        },
      },
      {
        label: 'Position',
        submenu: [
          {
            label: 'Top Left',
            type: 'radio',
            checked: config.position === 'top-left',
            click: () => setConfig({ position: 'top-left' }),
          },
          {
            label: 'Top Right',
            type: 'radio',
            checked: config.position === 'top-right',
            click: () => setConfig({ position: 'top-right' }),
          },
          {
            label: 'Bottom Left',
            type: 'radio',
            checked: config.position === 'bottom-left',
            click: () => setConfig({ position: 'bottom-left' }),
          },
          {
            label: 'Bottom Right',
            type: 'radio',
            checked: config.position === 'bottom-right',
            click: () => setConfig({ position: 'bottom-right' }),
          },
        ],
      },
      {
        label: 'Opacity',
        submenu: [
          {
            label: '100%',
            type: 'radio',
            checked: config.opacity === 1,
            click: () => setConfig({ opacity: 1 }),
          },
          {
            label: '80%',
            type: 'radio',
            checked: config.opacity === 0.8,
            click: () => setConfig({ opacity: 0.8 }),
          },
          {
            label: '60%',
            type: 'radio',
            checked: config.opacity === 0.6,
            click: () => setConfig({ opacity: 0.6 }),
          },
          {
            label: '40%',
            type: 'radio',
            checked: config.opacity === 0.4,
            click: () => setConfig({ opacity: 0.4 }),
          },
        ],
      },
    ];
  },
  renderer: {
    config: null,
    api: null,
    timerElement: null,
    intervalId: null,
    currentDuration: 0,
    currentTime: 0,

    formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    createTimerElement() {
      if (this.timerElement) {
        this.timerElement.remove();
      }

      this.timerElement = document.createElement('div');
      this.timerElement.id = 'song-timer-display';
      this.timerElement.style.cssText = `
        position: fixed;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 500;
        pointer-events: none;
        user-select: none;
        transition: opacity 0.2s ease;
      `;

      this.updatePosition();
      this.updateOpacity();
      
      document.body.appendChild(this.timerElement);
    },

    updatePosition() {
      if (!this.timerElement || !this.config) return;

      const { position } = this.config;
      const offset = '20px';

      switch (position) {
        case 'top-left':
          this.timerElement.style.top = offset;
          this.timerElement.style.left = offset;
          this.timerElement.style.right = 'auto';
          this.timerElement.style.bottom = 'auto';
          break;
        case 'top-right':
          this.timerElement.style.top = offset;
          this.timerElement.style.right = offset;
          this.timerElement.style.left = 'auto';
          this.timerElement.style.bottom = 'auto';
          break;
        case 'bottom-left':
          this.timerElement.style.bottom = offset;
          this.timerElement.style.left = offset;
          this.timerElement.style.right = 'auto';
          this.timerElement.style.top = 'auto';
          break;
        case 'bottom-right':
          this.timerElement.style.bottom = offset;
          this.timerElement.style.right = offset;
          this.timerElement.style.left = 'auto';
          this.timerElement.style.top = 'auto';
          break;
      }
    },

    updateOpacity() {
      if (!this.timerElement || !this.config) return;
      this.timerElement.style.opacity = this.config.opacity.toString();
    },

    updateTimer() {
      if (!this.timerElement || !this.config || !this.api) return;

      try {
        this.currentTime = this.api.getCurrentTime() || 0;
        this.currentDuration = this.api.getDuration() || 0;

        if (this.currentDuration > 0) {
          const timeToShow = this.config.showCountdown 
            ? this.currentDuration - this.currentTime 
            : this.currentTime;
          
          const prefix = this.config.showCountdown ? '-' : '';
          this.timerElement.textContent = prefix + this.formatTime(timeToShow);
          this.timerElement.style.display = 'block';
        } else {
          this.timerElement.style.display = 'none';
        }
      } catch (error) {
        // Silently handle any API errors
        console.debug('Song Timer: Error updating timer', error);
      }
    },

    startTimer() {
      this.stopTimer();
      this.intervalId = setInterval(() => {
        this.updateTimer();
      }, 1000);
    },

    stopTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    async start({ getConfig }) {
      this.config = await getConfig();
      this.createTimerElement();
    },

    onPlayerApiReady(api) {
      this.api = api;
      this.startTimer();
    },

    stop() {
      this.stopTimer();
      if (this.timerElement) {
        this.timerElement.remove();
        this.timerElement = null;
      }
    },

    onConfigChange(newConfig) {
      this.config = newConfig;
      if (this.timerElement) {
        this.updatePosition();
        this.updateOpacity();
      }
    },
  },
});