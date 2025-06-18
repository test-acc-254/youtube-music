import { FastAverageColor } from 'fast-average-color';
import Color, { ColorInstance } from 'color';

import style from './style.css?inline';

import { createPlugin } from '@/utils';
import { t } from '@/i18n';

const COLOR_KEY = '--ytmusic-album-color';
const DARK_COLOR_KEY = '--ytmusic-album-color-dark';
const RATIO_KEY = '--ytmusic-album-color-ratio';
const SCHEME_KEY = '--ytmusic-dark-scheme';

type DarkScheme = 'deep-black' | 'charcoal' | 'midnight-blue' | 'warm-gray' | 'cool-gray';

const DARK_SCHEMES: Record<DarkScheme, {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    surface: string;
    accent: string;
  };
}> = {
  'deep-black': {
    name: 'Deep Black',
    colors: {
      primary: '#000000',
      secondary: '#0a0a0a',
      tertiary: '#141414',
      background: '#000000',
      surface: '#1a1a1a',
      accent: '#333333',
    },
  },
  'charcoal': {
    name: 'Charcoal',
    colors: {
      primary: '#1a1a1a',
      secondary: '#242424',
      tertiary: '#2e2e2e',
      background: '#1a1a1a',
      surface: '#2a2a2a',
      accent: '#404040',
    },
  },
  'midnight-blue': {
    name: 'Midnight Blue',
    colors: {
      primary: '#0d1117',
      secondary: '#161b22',
      tertiary: '#21262d',
      background: '#0d1117',
      surface: '#1c2128',
      accent: '#30363d',
    },
  },
  'warm-gray': {
    name: 'Warm Gray',
    colors: {
      primary: '#1c1917',
      secondary: '#292524',
      tertiary: '#3c3a37',
      background: '#1c1917',
      surface: '#2d2a27',
      accent: '#44403c',
    },
  },
  'cool-gray': {
    name: 'Cool Gray',
    colors: {
      primary: '#111827',
      secondary: '#1f2937',
      tertiary: '#374151',
      background: '#111827',
      surface: '#1f2937',
      accent: '#4b5563',
    },
  },
};

export default createPlugin<
  unknown,
  unknown,
  {
    color?: ColorInstance;
    darkColor?: ColorInstance;
    currentScheme: DarkScheme;
    getConfig?: () => Promise<{
      enabled: boolean;
      ratio: number;
      darkScheme: DarkScheme;
      albumColorEnabled: boolean;
    }>;

    playerPage: HTMLElement | null;
    navBarBackground: HTMLElement | null;
    ytmusicPlayerBar: HTMLElement | null;
    playerBarBackground: HTMLElement | null;
    sidebarBig: HTMLElement | null;
    sidebarSmall: HTMLElement | null;
    ytmusicAppLayout: HTMLElement | null;

    getMixedColor(
      color: string,
      key: string,
      alpha?: number,
      ratioMultiply?: number,
    ): string;
    updateColor(): void;
    applyDarkScheme(): void;
  },
  {
    enabled: boolean;
    ratio: number;
    darkScheme: DarkScheme;
    albumColorEnabled: boolean;
  }
>({
  name: () => t('plugins.enhanced-dark-mode.name') || 'Enhanced Dark Mode',
  description: () => t('plugins.enhanced-dark-mode.description') || 'Advanced dark mode with multiple color schemes and album color integration',
  restartNeeded: false,
  config: {
    enabled: false,
    ratio: 0.3,
    darkScheme: 'deep-black',
    albumColorEnabled: true,
  },
  stylesheets: [style],
  menu: async ({ getConfig, setConfig }) => {
    const ratioList = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    const config = await getConfig();

    return [
      {
        label: 'Dark Color Scheme',
        submenu: Object.entries(DARK_SCHEMES).map(([key, scheme]) => ({
          label: scheme.name,
          type: 'radio',
          checked: config.darkScheme === key,
          click() {
            setConfig({ darkScheme: key as DarkScheme });
          },
        })),
      },
      {
        label: 'Album Color Integration',
        type: 'checkbox',
        checked: config.albumColorEnabled,
        click() {
          setConfig({ albumColorEnabled: !config.albumColorEnabled });
        },
      },
      {
        label: 'Album Color Mix Ratio',
        enabled: config.albumColorEnabled,
        submenu: ratioList.map((ratio) => ({
          label: `${ratio * 100}%`,
          type: 'radio',
          checked: config.ratio === ratio,
          click() {
            setConfig({ ratio });
          },
        })),
      },
    ];
  },
  renderer: {
    playerPage: null,
    navBarBackground: null,
    ytmusicPlayerBar: null,
    playerBarBackground: null,
    sidebarBig: null,
    sidebarSmall: null,
    ytmusicAppLayout: null,
    currentScheme: 'deep-black',

    async start({ getConfig }) {
      this.getConfig = getConfig;
      this.playerPage = document.querySelector<HTMLElement>('#player-page');
      this.navBarBackground = document.querySelector<HTMLElement>(
        '#nav-bar-background',
      );
      this.ytmusicPlayerBar =
        document.querySelector<HTMLElement>('ytmusic-player-bar');
      this.playerBarBackground = document.querySelector<HTMLElement>(
        '#player-bar-background',
      );
      this.sidebarBig = document.querySelector<HTMLElement>('#guide-wrapper');
      this.sidebarSmall = document.querySelector<HTMLElement>(
        '#mini-guide-background',
      );
      this.ytmusicAppLayout = document.querySelector<HTMLElement>('#layout');

      const config = await getConfig();
      this.currentScheme = config.darkScheme;
      
      document.documentElement.style.setProperty(
        RATIO_KEY,
        `${~~(config.ratio * 100)}%`,
      );
      document.documentElement.style.setProperty(
        SCHEME_KEY,
        config.darkScheme,
      );

      this.applyDarkScheme();
    },

    onPlayerApiReady(playerApi) {
      const fastAverageColor = new FastAverageColor();

      document.addEventListener('videodatachange', async (event) => {
        if (event.detail.name !== 'dataloaded') return;

        const config = await this.getConfig?.() ?? { albumColorEnabled: true };
        if (!config.albumColorEnabled) {
          document.documentElement.style.setProperty(COLOR_KEY, '0, 0, 0');
          document.documentElement.style.setProperty(DARK_COLOR_KEY, '0, 0, 0');
          this.updateColor();
          return;
        }

        const playerResponse = playerApi.getPlayerResponse();
        const thumbnail =
          playerResponse?.videoDetails?.thumbnail?.thumbnails?.at(0);
        if (!thumbnail) return;

        const albumColor = await fastAverageColor
          .getColorAsync(thumbnail.url)
          .catch((err) => {
            console.error(err);
            return null;
          });

        if (albumColor) {
          const target = Color(albumColor.hex);
          
          // Enhanced color processing based on current dark scheme
          const scheme = DARK_SCHEMES[this.currentScheme];
          const baseLuminosity = Color(scheme.colors.primary).luminosity();
          
          this.darkColor = target.darken(0.4).rgb();
          this.color = target.darken(0.2).rgb();

          // Ensure colors work well with the selected dark scheme
          while (this.color.luminosity() > baseLuminosity + 0.3) {
            this.color = this.color?.darken(0.05);
            this.darkColor = this.darkColor?.darken(0.05);
          }

          // Adjust saturation based on scheme
          if (this.currentScheme === 'midnight-blue') {
            this.color = this.color.desaturate(0.2);
            this.darkColor = this.darkColor.desaturate(0.2);
          } else if (this.currentScheme === 'warm-gray') {
            this.color = this.color.desaturate(0.3).rotate(10);
            this.darkColor = this.darkColor.desaturate(0.3).rotate(10);
          }

          document.documentElement.style.setProperty(
            COLOR_KEY,
            `${~~this.color.red()}, ${~~this.color.green()}, ${~~this.color.blue()}`,
          );
          document.documentElement.style.setProperty(
            DARK_COLOR_KEY,
            `${~~this.darkColor.red()}, ${~~this.darkColor.green()}, ${~~this.darkColor.blue()}`,
          );
        } else {
          document.documentElement.style.setProperty(COLOR_KEY, '0, 0, 0');
          document.documentElement.style.setProperty(DARK_COLOR_KEY, '0, 0, 0');
        }

        this.updateColor();
      });
    },

    onConfigChange(config) {
      this.currentScheme = config.darkScheme;
      document.documentElement.style.setProperty(
        RATIO_KEY,
        `${~~(config.ratio * 100)}%`,
      );
      document.documentElement.style.setProperty(
        SCHEME_KEY,
        config.darkScheme,
      );
      this.applyDarkScheme();
      this.updateColor();
    },

    getMixedColor(color: string, key: string, alpha = 1, ratioMultiply) {
      const keyColor = `rgba(var(${key}), ${alpha})`;

      let colorRatio = `var(${RATIO_KEY}, 30%)`;
      let originalRatio = `calc(100% - var(${RATIO_KEY}, 30%))`;
      if (ratioMultiply) {
        colorRatio = `calc(var(${RATIO_KEY}, 30%) * ${ratioMultiply})`;
        originalRatio = `calc(100% - calc(var(${RATIO_KEY}, 30%) * ${ratioMultiply}))`;
      }
      return `color-mix(in srgb, ${color} ${originalRatio}, ${keyColor} ${colorRatio})`;
    },

    applyDarkScheme() {
      const scheme = DARK_SCHEMES[this.currentScheme];
      
      // Apply base scheme colors
      document.documentElement.style.setProperty(
        '--enhanced-dark-primary',
        scheme.colors.primary,
        'important',
      );
      document.documentElement.style.setProperty(
        '--enhanced-dark-secondary',
        scheme.colors.secondary,
        'important',
      );
      document.documentElement.style.setProperty(
        '--enhanced-dark-tertiary',
        scheme.colors.tertiary,
        'important',
      );
      document.documentElement.style.setProperty(
        '--enhanced-dark-background',
        scheme.colors.background,
        'important',
      );
      document.documentElement.style.setProperty(
        '--enhanced-dark-surface',
        scheme.colors.surface,
        'important',
      );
      document.documentElement.style.setProperty(
        '--enhanced-dark-accent',
        scheme.colors.accent,
        'important',
      );

      // Set data attribute for scheme-specific styling
      document.documentElement.setAttribute('data-dark-scheme', this.currentScheme);
    },

    updateColor() {
      const scheme = DARK_SCHEMES[this.currentScheme];
      
      const variableMap = {
        '--ytmusic-color-black1': scheme.colors.secondary,
        '--ytmusic-color-black2': scheme.colors.primary,
        '--ytmusic-color-black3': scheme.colors.background,
        '--ytmusic-color-black4': scheme.colors.background,
        '--ytmusic-color-blackpure': scheme.colors.primary,
        '--dark-theme-background-color': scheme.colors.secondary,
        '--yt-spec-base-background': scheme.colors.background,
        '--yt-spec-raised-background': scheme.colors.secondary,
        '--yt-spec-menu-background': scheme.colors.surface,
        '--yt-spec-static-brand-black': scheme.colors.secondary,
        '--yt-spec-static-overlay-background-solid': scheme.colors.primary,
        '--yt-spec-general-background-a': scheme.colors.primary,
        '--yt-spec-general-background-b': scheme.colors.background,
        '--yt-spec-general-background-c': scheme.colors.background,
        '--yt-spec-snackbar-background': scheme.colors.background,
        '--yt-spec-filled-button-text': scheme.colors.background,
        '--yt-spec-black-1': scheme.colors.surface,
        '--yt-spec-black-2': scheme.colors.tertiary,
        '--yt-spec-black-3': scheme.colors.secondary,
        '--yt-spec-black-4': scheme.colors.primary,
        '--yt-spec-black-pure': scheme.colors.primary,
      };

      Object.entries(variableMap).map(([variable, color]) => {
        document.documentElement.style.setProperty(
          variable,
          this.getMixedColor(color, COLOR_KEY),
          'important',
        );
      });

      document.body.style.setProperty(
        'background',
        this.getMixedColor(scheme.colors.background, COLOR_KEY),
        'important',
      );
      document.documentElement.style.setProperty(
        '--ytmusic-background',
        this.getMixedColor(scheme.colors.background, DARK_COLOR_KEY),
        'important',
      );
    },
  },
});