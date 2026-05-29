<div align="center">

# YouTube Music

[![GitHub release](https://img.shields.io/github/release/th-ch/youtube-music.svg?style=for-the-badge&logo=youtube-music)](https://github.com/th-ch/youtube-music/releases/)
[![GitHub license](https://img.shields.io/github/license/th-ch/youtube-music.svg?style=for-the-badge)](https://github.com/th-ch/youtube-music/blob/master/license)
[![Build status](https://img.shields.io/github/actions/workflow/status/th-ch/youtube-music/build.yml?branch=master&style=for-the-badge&logo=youtube-music)](https://GitHub.com/th-ch/youtube-music/releases/)
[![GitHub All Releases](https://img.shields.io/github/downloads/th-ch/youtube-music/total?style=for-the-badge&logo=youtube-music)](https://GitHub.com/th-ch/youtube-music/releases/)
[![AUR](https://img.shields.io/aur/version/youtube-music-bin?color=blueviolet&style=for-the-badge&logo=youtube-music)](https://aur.archlinux.org/packages/youtube-music-bin)
[![Known Vulnerabilities](https://snyk.io/test/github/th-ch/youtube-music/badge.svg)](https://snyk.io/test/github/th-ch/youtube-music)
[![eslint code style](https://img.shields.io/badge/code_style-eslint-5ed9c7.svg?style=for-the-badge)](https://github.com/th-ch/youtube-music/blob/master/eslint.config.mjs)

</div>

![Screenshot](web/screenshot.png "Screenshot")

<div align="center">
	<a href="https://github.com/th-ch/youtube-music/releases/latest">
		<img src="web/youtube-music.svg" width="400" height="100" alt="YouTube Music SVG">
	</a>
</div>

Read this in other languages: [🇰🇷](./docs/readme/README-ko.md), [🇫🇷](./docs/readme/README-fr.md), [🇮🇸](./docs/readme/README-is.md), [🇨🇱 🇪🇸](./docs/readme/README-es.md), [🇷🇺](./docs/readme/README-ru.md), [🇭🇺](./docs/readme/README-hu.md)

---

## Project Overview

**YouTube Music Desktop App** is an Electron wrapper around [YouTube Music](https://music.youtube.com/) featuring a rich plugin system. It preserves the native YouTube Music web interface while adding desktop-native capabilities, customization, and quality-of-life enhancements.

### Key Features

- **Native desktop experience** - Frameless window, system tray, taskbar media controls, global shortcuts, and MPRIS support
- **30+ built-in plugins** - Ad blocking, downloader, visualizer, crossfade, Discord Rich Presence, synced lyrics, SponsorBlock, and more
- **Plugin framework** - Create your own plugins with backend/renderer/preload architecture
- **Cross-platform** - Windows, macOS, and Linux with native installers (AppImage, Flatpak, deb, rpm, snap, dmg)
- **Theme support** - Load custom CSS themes
- **Translation-ready** - Community translations via Weblate (40+ languages)
- **Automatic updates** - Built-in update notifications

|                          Player Screen (album color theme & ambient light)                                |
|:---------------------------------------------------------------------------------------------------------:|
|![Screenshot1](https://github.com/th-ch/youtube-music/assets/16558115/53efdf73-b8fa-4d7b-a235-b96b91ea77fc)|

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Electron](https://www.electronjs.org/) 35 |
| Language | [TypeScript](https://www.typescriptlang.org/) 5.8 |
| UI Framework | [SolidJS](https://www.solidjs.com/) 1.9 |
| Build Tool | [electron-vite](https://electron-vite.org/) / [Vite](https://vitejs.dev/) 6 |
| Package Manager | [pnpm](https://pnpm.io/) 10+ |
| Testing | [Playwright](https://playwright.dev/) |
| Linting | [ESLint](https://eslint.org/) 9 / [Prettier](https://prettier.io/) |
| Packaging | [electron-builder](https://www.electron.build/) 26 |

---

## Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Usage](#usage)
- [Plugins](#plugins)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [FAQ](#faq)

---

## Installation

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 ([install guide](https://pnpm.io/installation))

### Download Prebuilt Binaries

The easiest way is to download from the [latest release](https://github.com/th-ch/youtube-music/releases/latest).

#### Arch Linux

```bash
# AUR package
yay -S youtube-music-bin
# or
paru -S youtube-music-bin
```

#### macOS

```bash
# Homebrew
brew install th-ch/youtube-music/youtube-music
```

If you install manually and get "is damaged and can't be opened":

```bash
/usr/bin/xattr -cr /Applications/YouTube\ Music.app
```

#### Windows

```bash
# Scoop
scoop bucket add extras
scoop install extras/youtube-music

# Winget
winget install th-ch.YouTubeMusic
```

#### Offline Windows Installation

1. Download the `*.nsis.7z` file for your architecture from the [release page](https://github.com/th-ch/youtube-music/releases/latest)
2. Download the `*-Setup.exe` installer
3. Place both in the same directory
4. Run the installer

### Build from Source

```bash
git clone https://github.com/th-ch/youtube-music
cd youtube-music
pnpm install --frozen-lockfile
pnpm dev
```

### Environment Variables

| Variable | Description |
|----------|------------|
| `ELECTRON_ENABLE_LOGGING=1` | Enable Electron logging |
| `NODE_OPTIONS=--enable-source-maps` | Enable source maps in dev mode |
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` | Skip Playwright browser download during CI |

No database setup is required - all user configuration is stored locally via `electron-store`.

---

## Usage

### Basic Usage

Launch the app:

```bash
pnpm start        # Production preview
pnpm dev          # Development mode with hot reload
pnpm dev:debug    # Dev mode with logging
```

The app loads YouTube Music and applies plugins automatically. Toggle plugins via **Options > Plugins**.

### Configuration Options

Configuration is managed through the app's UI (Options menu) and persisted automatically. Available options include:

| Option | Description |
|--------|------------|
| Language | UI language (auto-detected, 40+ languages) |
| Themes | Load custom CSS files |
| Tray | Minimize to system tray |
| Hide Menu | Auto-hide menu bar (press `Alt` or backtick to show) |
| Resume on Start | Restore last-played URL on launch |
| Always on Top | Keep window above others |
| Start at Login | Auto-start with system |
| Auto Updates | Check for updates on launch |
| Proxy | Custom proxy server |
| Override User Agent | Custom user agent per platform |
| Auto Reset App Cache | Clear cache after 20s |
| Disable Hardware Acceleration | Toggle GPU acceleration |

### API Server Plugin

The API Server plugin provides a REST API for remote control:

```bash
# Default endpoint: http://localhost:9863
curl http://localhost:9863/song-info          # Current song info
curl http://localhost:9863/play-pause          # Toggle playback
curl http://localhost:9863/next                # Next track
curl http://localhost:9863/previous            # Previous track
curl http://localhost:9863/volume              # Get/set volume
curl http://localhost:9863/queue               # Get queue
curl http://localhost:9863/seek?position=30    # Seek to 30s
curl http://localhost:9863/set-volume?volume=0.5  # Set volume
```

### Protocol Handler

The app registers a custom `youtubemusic://` protocol for deep linking:

```bash
youtubemusic://search?q=artist+song
youtubemusic://play
youtubemusic://pause
```

---

## Plugins

30+ built-in plugins, each toggleable via the Options menu:

| Plugin | Description |
|--------|------------|
| Ad Blocker | Block ads and tracking |
| Album Actions | Bulk like/dislike for albums/playlists |
| Album Color Theme | Dynamic theme from album art colors |
| Ambient Mode | Cast video colors into screen background |
| Audio Compressor | Dynamic range compression |
| Blur Navigation Bar | Transparent/blurred nav bar |
| Bypass Age Restrictions | Bypass YouTube age verification |
| Captions Selector | Enable captions |
| Compact Sidebar | Always compact sidebar mode |
| Crossfade | Crossfade between songs |
| Disable Autoplay | Start every song paused |
| Discord Rich Presence | Show listening status on Discord |
| Downloader | Download MP3 from the interface |
| Equalizer | Frequency filters with presets (bass booster, etc.) |
| Exponential Volume | Logarithmic volume curve for finer control |
| In-App Menu | Fancy dark in-app menu bar |
| Lumia Stream | Integration with Lumia Stream |
| Lyrics Genius | Lyrics from Genius |
| Music Together | Sync playback with others via PeerJS |
| Navigation | In-app back/forward arrows |
| No Google Login | Remove Google login prompts |
| Notifications | Desktop notifications on song change |
| Picture-in-Picture | Floating video player |
| Playback Speed | Variable speed slider |
| Precise Volume | Fine-grained volume control |
| Scrobbler | Last.fm / ListenBrainz scrobbling |
| Shortcuts & MPRIS | Global hotkeys + Linux MPRIS |
| Skip Disliked Songs | Auto-skip disliked tracks |
| Skip Silences | Skip silent sections |
| SponsorBlock | Skip non-music segments (intro/outro) |
| Synced Lyrics | Time-synced lyrics from LRCLib, MusixMatch |
| Taskbar Media Control | Windows taskbar playback controls |
| TouchBar | macOS TouchBar controls |
| Tuna OBS | OBS integration via Tuna plugin |
| Unobtrusive Player | Minimal player interface |
| Video Quality Changer | Change video quality on the fly |
| Video Toggle | Switch video/song mode |
| Visualizer | Audio visualizers (wave, vudio, butterchurn) |

### Themes

Load custom CSS themes via **Options > Visual Tweaks > Themes**. Community themes are available at [kerichdev/themes-for-ytmdesktop-player](https://github.com/kerichdev/themes-for-ytmdesktop-player).

### Translation

Help translate the app on [Hosted Weblate](https://hosted.weblate.org/projects/youtube-music/).

<a href="https://hosted.weblate.org/engage/youtube-music/">
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/multi-auto.svg" alt="translation status" />
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/287x66-black.png" alt="translation status 2" />
</a>

---

## Development

### Project Structure

```
├── src/
│   ├── index.ts              # Main process entry
│   ├── preload.ts            # Preload script
│   ├── renderer.ts           # Renderer entry (SolidJS)
│   ├── config/               # Configuration management
│   ├── i18n/                 # Internationalization
│   ├── loader/               # Plugin loader (main, preload, renderer)
│   ├── menu.ts               # Application menu
│   ├── tray.ts               # System tray
│   ├── providers/            # Services (song-info, app-controls, etc.)
│   ├── plugins/              # Built-in plugins
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Shared utilities
├── vite-plugins/             # Custom Vite plugins (plugin loader, i18n)
├── assets/                   # Icons, images, error page
├── web/                      # Web assets (screenshots)
├── tests/                    # Playwright tests
├── docs/                     # Documentation
├── electron.vite.config.mts  # electron-vite configuration
├── tsconfig.json             # TypeScript config
├── eslint.config.mjs         # ESLint flat config
└── package.json              # Dependencies and scripts
```

### Development Workflow

```bash
# Start dev server with hot reload
pnpm dev

# Start dev server with debug logging
pnpm dev:debug

# Type check
pnpm typecheck

# Lint
pnpm lint

# Run tests
pnpm test

# Build (production)
pnpm build

# Build for distribution
pnpm dist:linux              # AppImage, deb, rpm, snap, flatpak
pnpm dist:mac                # macOS dmg (x64)
pnpm dist:mac:arm64          # macOS dmg (arm64)
pnpm dist:win                # Windows installer + portable
```

### Testing

Tests use [Playwright](https://playwright.dev/):

```bash
pnpm test                    # Run tests
pnpm test:debug              # Run tests with debug logging
```

### Code Style

- **TypeScript** with strict mode
- **SolidJS** for reactive UI components
- **ESLint** 9 with flat config + **Prettier** for formatting
- Import order: builtin → external → internal → parent → type (with groups separated by newlines)
- Single quotes, semicolons, trailing commas
- Arrow parens always, object curly spacing

Run `pnpm lint` before committing.

### Build Your Own Plugins

Plugins can:
- Manipulate the `BrowserWindow` via the Electron main process
- Change the frontend by manipulating HTML/CSS
- Communicate between front and back via IPC

Create a folder in `src/plugins/YOUR-PLUGIN-NAME/` with an `index.ts`:

```typescript
import style from './style.css?inline';

import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Plugin Label',
  restartNeeded: true,
  config: { enabled: false },
  stylesheets: [style],
  menu: async ({ getConfig, setConfig }) => {
    const config = await getConfig();
    return [
      {
        label: 'menu',
        submenu: [1, 2, 3].map((value) => ({
          label: `value ${value}`,
          type: 'radio',
          checked: config.value === value,
          click() { setConfig({ value }); },
        })),
      },
    ];
  },
  backend: {
    start({ window, ipc }) {
      window.maximize();
      ipc.handle('some-event', () => 'hello');
    },
    onConfigChange(newConfig) { /* ... */ },
    stop(context) { /* ... */ },
  },
  renderer: {
    async start(context) {
      console.log(await context.ipc.invoke('some-event'));
    },
    onPlayerApiReady(api, context) {
      context.setConfig({ myConfig: api.getVolume() });
    },
    onConfigChange(newConfig) { /* ... */ },
    stop(context) { /* ... */ },
  },
  preload: {
    async start({ getConfig }) {
      const config = await getConfig();
    },
    onConfigChange(newConfig) {},
    stop(context) {},
  },
});
```

#### Plugin Lifecycle Hooks

| Hook | Context | Description |
|------|---------|-------------|
| `start` | All | Called when plugin is enabled |
| `onConfigChange` | All | Called when plugin config changes |
| `stop` | All | Called when plugin is disabled |
| `onPlayerApiReady` | Renderer only | Called when YouTube player API is ready |
| `menu` | Main only | Define custom menu items |

#### Common Patterns

**Inject custom CSS:**
```typescript
import style from './style.css?inline';
import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Plugin Label',
  restartNeeded: true,
  config: { enabled: false },
  stylesheets: [style],
  renderer() {},
});
```

**Modify HTML:**
```typescript
import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Plugin Label',
  restartNeeded: true,
  config: { enabled: false },
  renderer() {
    document.querySelector('.sign-in-link.ytmusic-nav-bar')?.remove();
  },
});
```

#### Available Plugins as Reference

Study existing plugins in [`src/plugins/`](src/plugins/) for real-world patterns including IPC communication (see `sponsorblock`), API servers (see `api-server`), and UI overlays (see `synced-lyrics`).

---

## Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `pnpm lint` and `pnpm typecheck` to verify
5. Commit with a descriptive message
6. Push to your fork and open a pull request

### Code Review Process

- All pull requests require CI checks to pass (build + test)
- Maintain code style: run `pnpm lint` before pushing
- Keep changes focused - one feature/fix per PR
- Update tests if adding new functionality

### Reporting Issues

- Use the [bug report template](https://github.com/th-ch/youtube-music/issues/new?template=bug_report.yml) for bugs
- Use the [feature request template](https://github.com/th-ch/youtube-music/issues/new?template=feature_request.yml) for suggestions
- Check the [existing issues](https://github.com/th-ch/youtube-music/issues) before filing a duplicate
- Include your app version, OS, and enabled plugins in bug reports

### Development Setup

See [Installation](#build-from-source) for build-from-source instructions, then:

```bash
pnpm dev
```

The app will load YouTube Music with hot-reload enabled. Toggle plugins in the Options menu to see your changes.

---

## License

MIT &copy; [th-ch](https://github.com/th-ch/youtube-music). See [license](license) for details.

---

## FAQ

### Why isn't the menu showing up?

If `Hide Menu` is enabled, press `Alt` (or backtick if using the in-app menu plugin) to reveal it.

### How do I disable hardware acceleration?

Go to **Options > Advanced > Disable Hardware Acceleration**.

### Can I use this without a Google account?

Yes. The **No Google Login** plugin removes Google login prompts from the interface.

### How do I report a crash?

The app logs crashes via `electron-unhandled`. Enable logging with `ELECTRON_ENABLE_LOGGING=1` and include the output in your bug report.

### Where is configuration stored?

Configuration is persisted via `electron-store` in your OS user data directory under `com.github.th-ch.youtube-music`.