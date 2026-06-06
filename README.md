<div align="center">

# YouTube Music

[![GitHub release](https://img.shields.io/github/release/th-ch/youtube-music.svg?style=for-the-badge&logo=youtube-music)](https://github.com/th-ch/youtube-music/releases/)
[![GitHub license](https://img.shields.io/github/license/th-ch/youtube-music.svg?style=for-the-badge)](https://github.com/th-ch/youtube-music/blob/master/license)
[![eslint code style](https://img.shields.io/badge/code_style-eslint-5ed9c7.svg?style=for-the-badge)](https://github.com/th-ch/youtube-music/blob/master/eslint.config.mjs)
[![Build status](https://img.shields.io/github/actions/workflow/status/th-ch/youtube-music/build.yml?branch=master&style=for-the-badge&logo=youtube-music)](https://GitHub.com/th-ch/youtube-music/releases/)
[![GitHub All Releases](https://img.shields.io/github/downloads/th-ch/youtube-music/total?style=for-the-badge&logo=youtube-music)](https://GitHub.com/th-ch/youtube-music/releases/)
[![AUR](https://img.shields.io/aur/version/youtube-music-bin?color=blueviolet&style=for-the-badge&logo=youtube-music)](https://aur.archlinux.org/packages/youtube-music-bin)
[![Known Vulnerabilities](https://snyk.io/test/github/th-ch/youtube-music/badge.svg)](https://snyk.io/test/github/th-ch/youtube-music)

</div>

![Screenshot](web/screenshot.png "Screenshot")

<div align="center">
  <a href="https://github.com/th-ch/youtube-music/releases/latest">
    <img src="web/youtube-music.svg" width="400" height="100" alt="YouTube Music SVG">
  </a>
</div>

Read this in other languages: [한국어](./docs/readme/README-ko.md), [Français](./docs/readme/README-fr.md), [Íslenska](./docs/readme/README-is.md), [Español](./docs/readme/README-es.md), [Русский](./docs/readme/README-ru.md), [Magyar](./docs/readme/README-hu.md)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Available Plugins](#available-plugins)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Translation](#translation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

**YouTube Music** is an Electron wrapper around [YouTube Music](https://music.youtube.com/) that provides a native desktop experience with an extensive plugin framework. It preserves the original web interface while adding powerful customization, quality-of-life improvements, and integrations.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop Shell | [Electron](https://www.electronjs.org/) 35 |
| Build System | [electron-vite](https://electron-vite.org/) / [Vite](https://vitejs.dev/) 6 |
| Frontend Framework | [SolidJS](https://www.solidjs.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5.8 |
| Package Manager | [pnpm](https://pnpm.io/) (v10+) |
| Testing | [Playwright](https://playwright.dev/) |
| Linting | [ESLint](https://eslint.org/) 9 + [Prettier](https://prettier.io/) |
| Distribution | [electron-builder](https://www.electron.build/) |

### Key Features

- **Native look & feel** - Retains the original YouTube Music interface while adding desktop-native window controls, taskbar integration, and system tray support
- **Plugin framework** - Modular plugin system with backend (main process), preload, and renderer hooks. Enable/disable plugins in one click
- **Cross-platform** - Windows (x64, ia32, arm64), macOS (x64, arm64), Linux (x64, arm64, armv7l) via AppImage, deb, rpm, flatpak, snap
- **Built-in ad blocking** - Powered by Ghostery's adblocker engine
- **Remote control API** - HTTP API server for external control (playback, queue, volume, etc.)
- **Auto-updates** - Seamless updates via electron-updater

## Features

- **Auto-confirm when paused** (always enabled): Disables the "Continue Watching?" popup that pauses music after inactivity

## Available Plugins

YouTube Music ships with **35+ plugins** covering audio, visuals, integrations, and quality-of-life improvements:

| Plugin | Description |
|--------|-------------|
| **Ad Blocker** | Block all ads and tracking out of the box |
| **Album Actions** | Bulk like/dislike/undislike songs in playlists/albums |
| **Album Color Theme** | Dynamic theme based on album art palette |
| **Ambient Mode** | Gentle color cast from video into screen background |
| **Audio Compressor** | Dynamic range compression (loudness normalization) |
| **Blur Navigation Bar** | Transparent and blurry navigation bar |
| **Bypass Age Restrictions** | Bypass YouTube age verification |
| **Captions Selector** | Enable and select captions |
| **Compact Sidebar** | Always keep sidebar in compact mode |
| **Crossfade** | Crossfade between songs |
| **Disable Autoplay** | Start every song in "paused" mode |
| **Discord Rich Presence** | Show currently playing song on Discord |
| **Downloader** | Download MP3 directly from the interface (youtube-dl) |
| **Equalizer** | Boost/cut specific frequency ranges (e.g., bass booster) with presets |
| **Exponential Volume** | Exponential volume slider for finer low-volume control |
| **In-App Menu** | Custom dark-styled menu bar |
| **Lumia Stream** | [Lumia Stream](https://lumiastream.com/) integration |
| **Lyrics Genius** | Lyrics support for most songs |
| **Music Together** | Shared playlist listening with others |
| **Navigation** | Back/Next navigation arrows integrated in the interface |
| **No Google Login** | Remove Google login buttons and links |
| **Notifications** | Desktop notifications on song change (interactive on Windows) |
| **Picture-in-Picture** | PiP mode for the video player |
| **Playback Speed** | Slider to control song playback speed |
| **Precise Volume** | Mousewheel/hotkey volume control with custom HUD |
| **Scrobbler** | Scrobble to [Last.fm](https://www.last.fm/) and [ListenBrainz](https://listenbrainz.org/) |
| **Shortcuts (& MPRIS)** | Global hotkeys, media key override, Ctrl+F search, Linux MPRIS support |
| **Skip Disliked Song** | Automatically skip disliked songs |
| **Skip Silences** | Automatically skip silenced sections in tracks |
| **SponsorBlock** | Skip non-music segments (intro, outro, etc.) |
| **Synced Lyrics** | Synced lyrics from [LRClib](https://lrclib.net) and other sources |
| **Taskbar Media Control** | Windows taskbar media playback controls |
| **TouchBar** | Custom macOS Touch Bar layout |
| **Tuna OBS** | [OBS](https://obsproject.com/) integration via [Tuna](https://obsproject.com/forum/resources/tuna.843/) plugin |
| **Unobtrusive Player** | Minimal player UI that stays out of the way |
| **Video Quality Changer** | Change video quality from the video overlay |
| **Video Toggle** | Switch between video/song mode; optionally remove the video tab |
| **Visualizer** | Music visualizers (powered by butterchurn) |

## Installation

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 ([install guide](https://pnpm.io/installation))

### Prebuilt Binaries

Download the latest release from the [releases page](https://github.com/th-ch/youtube-music/releases/latest).

#### Arch Linux

```bash
# AUR package
yay -S youtube-music-bin
# or
paru -S youtube-music-bin
```

#### macOS

```bash
brew install th-ch/youtube-music/youtube-music
```

If you see "is damaged and can't be opened" when launching:

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

> **Note**: Microsoft Defender SmartScreen may block the installer since it's from an "unknown publisher."

#### Offline Install (Windows)

1. Download the `*.nsis.7z` file for your architecture (`x64`, `ia32`, or `arm64`) from the [releases page](https://github.com/th-ch/youtube-music/releases/latest)
2. Download the `*-Setup.exe` installer
3. Place both files in the **same directory**
4. Run the installer

### Themes

You can load custom CSS themes via **Options > Visual Tweaks > Themes**. Predefined themes are available at [kerichdev/themes-for-ytmdesktop-player](https://github.com/kerichdev/themes-for-ytmdesktop-player).

### From Source

```bash
git clone https://github.com/th-ch/youtube-music
cd youtube-music
pnpm install --frozen-lockfile
pnpm dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | - |
| `ELECTRON_ENABLE_LOGGING` | Enable Electron logging | - |

## Usage

### Running the App

```bash
# Development mode (hot reload)
pnpm dev

# Production preview
pnpm start
```

### First Launch

The app loads `https://music.youtube.com` in an Electron window. Sign in with your Google account to access your library and playlists. Plugins can be configured via the app menu.

### API Server (Remote Control)

The **API Server** plugin provides an HTTP REST API for external remote control of the player.

**Enable it**: Options > Plugins > API Server

**Base URL**: `http://localhost:9863`

**Endpoints**:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/player` | Get current player state (song, position, volume) |
| `POST` | `/api/player/play` | Start/resume playback |
| `POST` | `/api/player/pause` | Pause playback |
| `POST` | `/api/player/next` | Skip to next track |
| `POST` | `/api/player/previous` | Go to previous track |
| `POST` | `/api/player/seek` | Seek to position (seconds) |
| `GET` | `/api/player/volume` | Get current volume |
| `POST` | `/api/player/volume` | Set volume |
| `GET` | `/api/player/shuffle` | Get shuffle state |
| `POST` | `/api/player/shuffle` | Toggle shuffle |
| `GET` | `/api/player/repeat` | Get repeat mode |
| `POST` | `/api/player/repeat` | Set repeat mode |
| `GET` | `/api/queue` | Get current queue |
| `POST` | `/api/queue/add` | Add song to queue |

Full API documentation is available at `http://localhost:9863/swagger` when the plugin is enabled.

## Configuration

Settings are stored in an `electron-store` JSON file and can be modified through the app's options menu.

### App Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tray` | boolean | `false` | Minimize to system tray |
| `autoUpdates` | boolean | `true` | Enable automatic updates |
| `alwaysOnTop` | boolean | `false` | Keep window on top |
| `hideMenu` | boolean | `false` | Hide the menu bar |
| `startAtLogin` | boolean | `false` | Launch on system startup |
| `disableHardwareAcceleration` | boolean | `false` | Disable GPU acceleration |
| `removeUpgradeButton` | boolean | `false` | Remove "Upgrade to Premium" button |
| `restartOnConfigChanges` | boolean | `false` | Restart when config changes |
| `trayClickPlayPause` | boolean | `false` | Tray click toggles play/pause |
| `autoResetAppCache` | boolean | `false` | Reset app cache on startup |
| `resumeOnStart` | boolean | `true` | Resume playback from last position |
| `proxy` | string | `''` | HTTP proxy URL |
| `startingPage` | string | `''` | Custom starting page |
| `themes` | string[] | `[]` | Paths to CSS theme files |
| `language` | string | - | UI language override |

### Plugin Configuration

Each plugin can have its own configuration, accessible via **Options > Plugins**. Plugin settings are stored in the `plugins` key of the config file.

## Development

### Project Structure

```
youtube-music/
├── assets/              # Icons, images, error page
├── docs/                # Documentation and readme translations
├── patches/             # pnpm patch files for dependencies
├── src/
│   ├── config/          # App configuration (defaults, store, schema)
│   ├── i18n/            # Internationalization files
│   ├── loader/          # Plugin loading system (main, preload, renderer)
│   ├── plugins/         # All built-in plugins (40+ directories)
│   │   ├── adblocker/
│   │   ├── api-server/  # HTTP REST API
│   │   ├── discord/
│   │   ├── downloader/
│   │   ├── sponsorblock/
│   │   └── ...
│   ├── providers/       # Song info, controls, DOM extraction
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Shared utilities
│   ├── index.ts         # Main process entry
│   ├── menu.ts          # Application menu
│   ├── preload.ts       # Preload script
│   ├── renderer.ts      # Renderer process entry
│   └── tray.ts          # System tray
├── tests/               # Playwright e2e tests
├── vite-plugins/        # Custom Vite plugins (plugin loader, i18n)
├── web/                 # Web assets (SVG logos, screenshots)
├── electron.vite.config.mts
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

### Development Workflow

```bash
# Clone and install
git clone https://github.com/th-ch/youtube-music
cd youtube-music
pnpm install --frozen-lockfile

# Start development (hot reload with watch mode)
pnpm dev

# Debug mode (with Electron logging)
pnpm dev:debug

# Renderer-only development (no backend reload)
pnpm dev:renderer

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### Code Style

The project uses:
- **ESLint 9** with flat config for linting
- **TypeScript strict mode** with `strict: true`, `noImplicitAny: true`
- **Prettier** for formatting (single quotes, 2-space indentation, trailing commas)
- **Import ordering**: builtin > external > internal/sibling/parent > parent > type (with blank lines between groups)
- **ESLint rules**: camelCase enforcement, no floating promises (warn), `@/` path alias for `./src/`

Run linting before committing:

```bash
pnpm lint
```

### Building Your Own Plugins

Plugins can manipulate the Electron `BrowserWindow`, inject CSS/HTML, and communicate between main and renderer processes.

#### Plugin Anatomy

Create a folder in `src/plugins/<plugin-name>` with:

```
src/plugins/my-plugin/
├── index.ts        # Main plugin definition
├── style.css       # (optional) Custom styles
└── ...             # (optional) Additional files
```

#### Minimal Plugin Example

```typescript
import style from './style.css?inline';
import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'My Plugin',
  restartNeeded: true,
  config: { enabled: false },
  stylesheets: [style],
  renderer() {
    // Runs in the renderer process
    console.log('My plugin started!');
  },
});
```

#### Full Plugin with Backend/Preload

```typescript
import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Advanced Plugin',
  restartNeeded: true,
  config: { enabled: true, value: 1 },
  menu: async ({ getConfig, setConfig }) => {
    const config = await getConfig();
    return [{
      label: 'Settings',
      submenu: [1, 2, 3].map((value) => ({
        label: `Value ${value}`,
        type: 'radio',
        checked: config.value === value,
        click() { setConfig({ value }); },
      })),
    }];
  },
  backend: {
    start({ window, ipc }) {
      window.maximize();
      ipc.handle('my-event', () => 'hello from main');
    },
    onConfigChange(newConfig) { /* ... */ },
    stop(context) { /* ... */ },
  },
  renderer: {
    async start(context) {
      const msg = await context.ipc.invoke('my-event');
      console.log(msg);
    },
    onPlayerApiReady(api, context) {
      context.setConfig({ myConfig: api.getVolume() });
    },
    onConfigChange(newConfig) { /* ... */ },
    stop(_context) { /* ... */ },
  },
  preload: {
    async start({ getConfig }) {
      const config = await getConfig();
    },
    onConfigChange(newConfig) { /* ... */ },
    stop(_context) { /* ... */ },
  },
});
```

#### Common Use Cases

**Inject Custom CSS**:
```typescript
import style from './style.css?inline';
import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Custom Style',
  restartNeeded: true,
  config: { enabled: false },
  stylesheets: [style],
  renderer() {},
});
```

**Modify HTML**:
```typescript
import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Hide Login',
  restartNeeded: true,
  config: { enabled: false },
  renderer() {
    document.querySelector('.sign-in-link.ytmusic-nav-bar')?.remove();
  },
});
```

## Building

### Production Build

```bash
# Build all platforms
pnpm dist

# Platform-specific builds
pnpm dist:win              # Windows (x64, ia32, arm64)
pnpm dist:linux            # Linux (amd64)
pnpm dist:linux:deb-arm64  # Linux (arm64, Debian)
pnpm dist:linux:rpm-arm64  # Linux (arm64, Fedora)
pnpm dist:mac              # macOS (amd64)
pnpm dist:mac:arm64        # macOS (arm64)

# Production preview (no packaging)
pnpm start
```

Builds are produced using [electron-builder](https://github.com/electron-user-builder/electron-builder).

### Release Builds

```bash
pnpm release:linux
pnpm release:mac
pnpm release:win
```

## Testing

Tests use [Playwright](https://playwright.dev/) for end-to-end testing of the Electron app.

```bash
# Run all tests
pnpm test

# Debug mode
pnpm test:debug
```

The test suite launches the app, verifies it loads `https://music.youtube.com`, and handles the consent form.

## Translation

Help translate YouTube Music into your language on [Hosted Weblate](https://hosted.weblate.org/projects/youtube-music/).

<a href="https://hosted.weblate.org/engage/youtube-music/">
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/multi-auto.svg" alt="Translation status" />
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/287x66-black.png" alt="Translation status" />
</a>

## Contributing

We welcome contributions! Here's how to get started:

### Reporting Issues

- **Bug reports**: Open an issue using the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml). Include your OS, app version, steps to reproduce, and expected behavior.
- **Feature requests**: Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml). Describe the feature and the problem it solves.

### Submitting Changes

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/my-feature`
3. **Make your changes** following the project's code style
4. **Run linting and typecheck**:
   ```bash
   pnpm lint
   pnpm typecheck
   ```
5. **Write/update tests** if applicable
6. **Commit** with a clear, descriptive message
7. **Push** and open a Pull Request

### Pull Request Guidelines

- Keep PRs focused on a single concern
- Reference related issues in the description
- Ensure the build passes (CI runs `pnpm lint` and `pnpm typecheck`)
- Follow the existing code style and conventions
- Update documentation if adding/changing features

### Code Review Process

- All PRs require at least one review from a maintainer
- Address review feedback promptly
- Maintainers may request changes for code quality, style, or architecture

## FAQ

### Why isn't the app menu showing up?

If **Hide Menu** is enabled, press <kbd>Alt</kbd> to show it temporarily. If using the In-App Menu plugin, press <kbd>\`</kbd> (backtick).

## License

MIT © [th-ch](https://github.com/th-ch/youtube-music)

See the [license](license) file for details.