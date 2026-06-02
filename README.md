<div align="center">

# YouTube Music

[![GitHub release](https://img.shields.io/github/release/th-ch/youtube-music.svg?style=for-the-badge&logo=youtube-music)](https://github.com/th-ch/youtube-music/releases/)
[![GitHub license](https://img.shields.io/github/license/th-ch/youtube-music.svg?style=for-the-badge)](https://github.com/th-ch/youtube-music/blob/master/license)
[![eslint code style](https://img.shields.io/badge/code_style-eslint-5ed9c7.svg?style=for-the-badge)](https://github.com/th-ch/youtube-music/blob/master/eslint.config.mjs)
[![Build status](https://img.shields.io/github/actions/workflow/status/th-ch/youtube-music/build.yml?branch=master&style=for-the-badge&logo=youtube-music)](https://GitHub.com/th-ch/youtube-music/releases/)
[![GitHub All Releases](https://img.shields.io/github/downloads/th-ch/youtube-music/total?style=for-the-badge&logo=youtube-music)](https://GitHub.com/th-ch/youtube-music/releases/)
[![AUR](https://img.shields.io/aur/version/youtube-music-bin?color=blueviolet&style=for-the-badge&logo=youtube-music)](https://aur.archlinux.org/packages/youtube-music-bin)
[![Snyk](https://snyk.io/test/github/th-ch/youtube-music/badge.svg)](https://snyk.io/test/github/th-ch/youtube-music)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/electron-35.1.2-47848F?style=for-the-badge&logo=electron)](https://www.electronjs.org/)

</div>

![Screenshot](web/screenshot.png "Screenshot")

<div align="center">
  <a href="https://github.com/th-ch/youtube-music/releases/latest">
    <img src="web/youtube-music.svg" width="400" height="100" alt="YouTube Music SVG">
  </a>
</div>

Read this in other languages: [🇰🇷](./docs/readme/README-ko.md), [🇫🇷](./docs/readme/README-fr.md), [🇮🇸](./docs/readme/README-is.md), [🇨🇱 🇪🇸](./docs/readme/README-es.md), [🇷🇺](./docs/readme/README-ru.md), [🇭🇺](./docs/readme/README-hu.md)

**YouTube Music** is an Electron wrapper around [YouTube Music](https://music.youtube.com) that delivers a native desktop experience with a rich plugin ecosystem. It combines the familiar YouTube Music web interface with powerful desktop features — ad blocking, audio enhancements, visualizers, Discord integration, downloader, scrobbling, and 30+ customizable plugins.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Available Plugins](#available-plugins)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [From Source](#from-source)
  - [Package Managers](#package-managers)
- [Usage](#usage)
  - [Configuration](#configuration)
  - [Command-Line Arguments](#command-line-arguments)
  - [Plugins](#plugins)
  - [API Server](#api-server)
  - [Themes](#themes)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Development Workflow](#development-workflow)
  - [Testing](#testing)
  - [Code Style & Linting](#code-style--linting)
  - [Building for Distribution](#building-for-distribution)
- [Building Your Own Plugins](#building-your-own-plugins)
  - [Creating a Plugin](#creating-a-plugin)
  - [Common Use Cases](#common-use-cases)
- [Contributing](#contributing)
  - [How to Contribute](#how-to-contribute)
  - [Code Review Process](#code-review-process)
  - [Issue Reporting](#issue-reporting)
  - [Translating](#translating)
- [FAQ](#faq)
- [License](#license)

## Key Features

- **Native Desktop Experience** — Runs YouTube Music in its own window with system tray, notifications, media keys, and taskbar integration.
- **Ad Blocking** — Built-in ad blocker powered by Ghostery blocks ads and trackers out of the box.
- **30+ Plugins** — Extend functionality with audio equalizer, Discord Rich Presence, Last.fm/ListenBrainz scrobbling, music visualizers, crossfade, sponsor-block skipping, sleep timer, and more.
- **Theming** — Dynamic album-color themes, ambient lighting effects, and custom CSS themes.
- **Cross-Platform** — Available on Windows (x64, arm64, ia32), macOS (x64, arm64), and Linux (AppImage, deb, rpm, snap, flatpak).
- **Internationalization** — Translated into 47+ languages via Weblate.
- **Built-In Downloader** — Download songs as MP3 directly from the interface using FFmpeg WASM.
- **REST API** — Expose playback controls via a built-in Hono HTTP API server (optional plugin).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | [Electron 35](https://www.electronjs.org/) (Chromium + Node.js) |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Build** | [electron-vite 3](https://electron-vite.org/) / [Vite 6](https://vitejs.dev/) |
| **UI (some plugins)** | [SolidJS 1.9](https://www.solidjs.com/) |
| **Packaging** | [electron-builder 26](https://www.electron.build/) |
| **State/Config** | [electron-store](https://github.com/sindresorhus/electron-store) (via `conf`) |
| **i18n** | [i18next](https://www.i18next.com/) |
| **Testing** | [Playwright](https://playwright.dev/) |
| **Linting** | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |
| **Package Manager** | [pnpm](https://pnpm.io/) (>= 10) |
| **Node.js** | >= 18 |

## Available Plugins

| Plugin | Description |
|--------|-------------|
| **Ad Blocker** | Block all ads and tracking out of the box |
| **Album Actions** | Bulk like/dislike/undislike for all songs in a playlist or album |
| **Album Color Theme** | Dynamic theme and visual effects based on album art color palette |
| **Ambient Mode** | Gentle lighting effect from video colors onto the screen background |
| **Audio Compressor** | Apply dynamic range compression to audio |
| **Blur Navigation Bar** | Transparent and blurry navigation bar |
| **Bypass Age Restrictions** | Bypass YouTube's age verification |
| **Captions Selector** | Enable and select captions |
| **Compact Sidebar** | Always keep the sidebar in compact mode |
| **Crossfade** | Crossfade between songs |
| **Disable Autoplay** | Start every song in paused mode |
| **Discord Rich Presence** | Show what you're listening to on Discord |
| **Downloader** | Download MP3s directly from the interface (FFmpeg WASM) |
| **Equalizer** | Boost or cut specific frequency ranges (e.g., bass booster) |
| **Exponential Volume** | Exponential volume curve for finer low-volume control |
| **In-App Menu** | Fancy dark in-app menu bar |
| **Scrobbler** | Scrobble to Last.fm and ListenBrainz |
| **Lumia Stream** | Integration with Lumia Stream |
| **Lyrics Genius** | Fetch and display lyrics for most songs |
| **Music Together** | Share listening sessions with others via PeerJS |
| **Navigation** | Forward/back navigation arrows in the interface |
| **No Google Login** | Remove Google login buttons and links |
| **Notifications** | Desktop notifications for song changes |
| **Picture-in-Picture** | Switch the app to PiP mode |
| **Playback Speed** | Adjustable song playback speed slider |
| **Precise Volume** | Mouse wheel/hotkey volume control with customizable steps |
| **Shortcuts & MPRIS** | Global hotkeys, MPRIS (Linux), search shortcut |
| **Skip Disliked Songs** | Automatically skip songs you've disliked |
| **Skip Silences** | Automatically skip silenced sections |
| **SponsorBlock** | Skip non-music segments (intro, outro, etc.) |
| **Synced Lyrics** | Synced lyrics via LRClib and other providers |
| **Taskbar Media Control** | Windows taskbar playback controls |
| **TouchBar** | Custom macOS Touch Bar layout |
| **Tuna OBS** | Integration with OBS Tuna plugin |
| **Quality Changer** | Change video quality from the video overlay |
| **Video Toggle** | Switch between video/song mode; optionally remove the video tab |
| **Visualizer** | Music visualizers (butterchurn, vudio, wave) |

## Installation

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 ([install guide](https://pnpm.io/installation))
- **git**

### From Source

```bash
git clone https://github.com/th-ch/youtube-music
cd youtube-music
pnpm install --frozen-lockfile
pnpm dev
```

This launches the app in development mode with hot reload.

### Package Managers

#### Arch Linux

Install `youtube-music-bin` from the AUR:

```bash
yay -S youtube-music-bin
# or with any other AUR helper
```

#### macOS

Via [Homebrew](https://github.com/th-ch/homebrew-youtube-music):

```bash
brew install th-ch/youtube-music/youtube-music
```

If you install the app manually and see "is damaged and can't be opened":

```bash
/usr/bin/xattr -cr /Applications/YouTube\ Music.app
```

#### Windows

Using [Scoop](https://scoop.sh):

```bash
scoop bucket add extras
scoop install extras/youtube-music
```

Using [Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/):

```bash
winget install th-ch.YouTubeMusic
```

> **Note:** Microsoft Defender SmartScreen may block the installer since it's from an "unknown publisher." This is expected for open-source Electron apps.

#### Offline Install (Windows)

1. Download the `.nsis.7z` file for your architecture from the [releases page](https://github.com/th-ch/youtube-music/releases/latest).
2. Download the `-Setup.exe` installer.
3. Place both files in the same directory.
4. Run the installer.

## Usage

### Configuration

All settings are managed through the app's Options menu. Configuration is persisted via `electron-store` and supports:

- **Plugins** — Enable/disable any plugin with a single toggle
- **Visual Tweaks** — Custom themes, album color theme enable/disable
- **Audio** — Equalizer presets, volume settings, crossfade duration
- **Shortcuts** — Custom global hotkeys
- **Downloads** — Output directory, download format

### Command-Line Arguments

The app supports most Electron command-line switches. Commonly used ones:

| Flag | Description |
|------|-------------|
| `--no-sandbox` | Disable Chromium sandbox (useful in containers) |
| `--disable-gpu` | Disable GPU acceleration |
| `--enable-logging` | Enable detailed logging |

### Plugins

Enable/disable plugins in **Options > Plugins**. Most plugins take effect immediately; some require a restart (indicated by a restart dialog).

### API Server

The **API Server** plugin (disabled by default) exposes a REST API via [Hono](https://hono.dev/). Enable it in Options > Plugins, then access:

```
http://localhost:9863/
```

Endpoints include:
- `GET /song` — Current song info
- `POST /play` — Start playback
- `POST /pause` — Pause playback
- `POST /next` — Next track
- `POST /previous` — Previous track
- `POST /volume` — Set volume
- `GET /queue` — Current queue
- `GET /search?q=query` — Search YouTube Music
- Swagger UI available at `/swagger`

### Themes

Load custom CSS in **Options > Visual Tweaks > Themes**. Pre-built themes are available at [themes-for-ytmdesktop-player](https://github.com/kerichdev/themes-for-ytmdesktop-player).

## Development

### Project Structure

```
youtube-music/
├── src/
│   ├── index.ts            # Electron main process entry
│   ├── preload.ts          # Preload script (contextBridge)
│   ├── renderer.ts         # Renderer process entry
│   ├── index.html          # Renderer HTML entry
│   ├── youtube-music.css   # Base CSS overrides
│   ├── config/             # Configuration system (electron-store)
│   ├── i18n/               # Internationalization (47 languages)
│   ├── menu.ts             # Application menu builder
│   ├── tray.ts             # System tray
│   ├── plugins/            # All 30+ plugins (one folder each)
│   ├── providers/          # Internal providers (song info, controls, etc.)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Shared utilities (createPlugin, etc.)
│   └── ts-declarations/    # Ambient type declarations
├── tests/                  # Playwright E2E tests
├── assets/                 # Icons and static assets
├── docs/                   # Documentation and translations
├── vite-plugins/           # Custom Vite plugins (loader, importer)
├── patches/                # patched dependencies
├── web/                    # Web assets (screenshots, banners)
├── electron.vite.config.mts # Vite configuration
├── eslint.config.mjs       # ESLint flat config
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project manifest
```

### Development Workflow

```bash
# Clone and install
git clone https://github.com/th-ch/youtube-music
cd youtube-music
pnpm install --frozen-lockfile

# Development mode (hot reload)
pnpm dev

# Dev with debug logging
pnpm dev:debug

# Dev without watching main process
pnpm dev:renderer

# Type-check
pnpm typecheck

# Lint
pnpm lint

# Run tests
pnpm test

# Build production bundles
pnpm build

# Preview production build
pnpm start
```

### Testing

Tests use [Playwright](https://playwright.dev/) for end-to-end testing:

```bash
# Run tests
pnpm test

# Run tests with debug output
pnpm test:debug
```

The test suite ([`tests/index.test.js`](tests/index.test.js)) launches the Electron app, navigates to YouTube Music, and verifies the URL loads correctly. When running in CI, tests use `xvfb` for headless display.

### Code Style & Linting

- **ESLint** — Flat config (`.eslint.config.mjs`) with TypeScript strict mode, stylistic rules, and import ordering
- **Prettier** — 2-space indentation, single quotes, no trailing commas
- **TypeScript** — Strict mode with `noUncheckedIndexedAccess`

```bash
pnpm lint
```

### Building for Distribution

```bash
# Build for all platforms
pnpm dist

# Platform-specific builds
pnpm dist:win              # Windows (x64, ia32, arm64)
pnpm dist:linux            # Linux (amd64)
pnpm dist:linux:deb-arm64  # Linux Debian arm64
pnpm dist:linux:rpm-arm64  # Linux Fedora arm64
pnpm dist:mac              # macOS amd64
pnpm dist:mac:arm64        # macOS arm64
```

Output is placed in the `pack/` directory. Uses [electron-builder](https://github.com/electron-userland/electron-builder) for packaging.

## Building Your Own Plugins

Using plugins, you can:

- Manipulate the Electron `BrowserWindow`
- Change the front end by manipulating HTML/CSS/DOM
- Communicate between main and renderer processes via IPC
- Add custom menu items
- Read/write plugin configuration

### Creating a Plugin

Create a folder in `src/plugins/YOUR-PLUGIN-NAME/` with an `index.ts`:

```typescript
import style from './style.css?inline';

import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Plugin Label',
  restartNeeded: true,
  config: {
    enabled: false,
  },
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
          click() {
            setConfig({ value });
          },
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
    onPlayerApiReady(api: YoutubePlayer, context: RendererContext) {
      context.setConfig({ myConfig: api.getVolume() });
    },
    onConfigChange(newConfig) { /* ... */ },
    stop(_context) { /* ... */ },
  },
  preload: {
    async start({ getConfig }) {
      const config = await getConfig();
    },
    onConfigChange(newConfig) {},
    stop(_context) {},
  },
});
```

### Common Use Cases

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

**Manipulate the DOM:**

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

**Communicate between main and renderer:**

Use `ipcMain` / `ipcRenderer` via the `ipc` object provided in plugin contexts. See the `sponsorblock` plugin for a complete example.

Each plugin can implement up to four lifecycle hooks: `backend` (main process), `preload` (preload script), `renderer` (browser), and `menu` (app menu contributions). The build system tree-shakes unused hooks per entry point.

## Contributing

### How to Contribute

We welcome contributions of all kinds — bug fixes, new plugins, documentation improvements, and translations.

1. Fork the repository.
2. Create a feature branch: `git checkout -b my-feature`.
3. Make your changes following the [code style](#code-style--linting).
4. Run `pnpm lint` and `pnpm typecheck` to verify your changes.
5. If adding a feature, include or update tests where applicable.
6. Commit with a clear, descriptive message.
7. Push to your fork and open a pull request.

### Code Review Process

- All PRs require CI to pass (lint, typecheck, build, tests).
- Maintainers review code for correctness, style, and adherence to project conventions.
- Plugin contributions should include documentation of the plugin's purpose, config options, and any new dependencies.
- Changes to the build system or core functionality require extra scrutiny.

### Issue Reporting

Before opening an issue:

- Search [existing issues](https://github.com/th-ch/youtube-music/issues) to avoid duplicates.
- Use the [bug report template](https://github.com/th-ch/youtube-music/issues/new?template=bug_report.yml) for bugs.
- Use the [feature request template](https://github.com/th-ch/youtube-music/issues/new?template=feature_request.yml) for feature ideas.
- Include your OS version, app version, and steps to reproduce.

### Translating

Translations are managed on [Hosted Weblate](https://hosted.weblate.org/projects/youtube-music/). To add or improve a translation:

1. Visit the [YouTube Music project on Weblate](https://hosted.weblate.org/engage/youtube-music/).
2. Select your language or request a new one.
3. Translate strings directly in the web interface.

<a href="https://hosted.weblate.org/engage/youtube-music/">
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/multi-auto.svg" alt="Translation status" />
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/287x66-black.png" alt="Translation status 2" />
</a>

## FAQ

### Why isn't the app menu showing up?

If the **Hide Menu** option is on, show the menu with the <kbd>alt</kbd> key (or <kbd>\`</kbd> — backtick — if using the In-App Menu plugin). See [this post](https://github.com/th-ch/youtube-music/issues/410#issuecomment-952060709) for more details.

## License

[MIT](license) © [th-ch](https://github.com/th-ch/youtube-music)
