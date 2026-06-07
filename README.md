<div align="center">

# YouTube Music

[![GitHub release](https://img.shields.io/github/release/th-ch/youtube-music.svg?style=for-the-badge&logo=youtube-music)](https://github.com/th-ch/youtube-music/releases/)
[![GitHub license](https://img.shields.io/github/license/th-ch/youtube-music.svg?style=for-the-badge)](https://github.com/th-ch/youtube-music/blob/master/license)
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

Read this in other languages: [🇰🇷](./docs/readme/README-ko.md), [🇫🇷](./docs/readme/README-fr.md), [🇮🇸](./docs/readme/README-is.md), [🇨🇱 🇪🇸](./docs/readme/README-es.md), [🇷🇺](./docs/readme/README-ru.md), [🇭🇺](./docs/readme/README-hu.md)

**Electron wrapper around YouTube Music featuring:**

- Native look & feel, aims at keeping the original interface
- Framework for custom plugins: change YouTube Music to your needs (style, content, features), enable/disable plugins in one click

---

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Available Plugins](#available-plugins)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [From Releases](#from-releases)
  - [Arch Linux](#arch-linux)
  - [macOS](#macos)
  - [Windows](#windows)
- [Usage](#usage)
  - [Running the App](#running-the-app)
  - [Configuration Options](#configuration-options)
  - [API Server](#api-server)
- [Project Structure](#project-structure)
- [Development](#development)
  - [Prerequisites](#prerequisites-1)
  - [Setup](#setup)
  - [Dev Workflow](#dev-workflow)
  - [Build](#build)
  - [Production Preview](#production-preview)
  - [Testing](#testing)
  - [Code Style & Linting](#code-style--linting)
  - [Type Checking](#type-checking)
- [Creating Plugins](#creating-plugins)
  - [Creating a Plugin](#creating-a-plugin)
  - [Common Use Cases](#common-use-cases)
- [Translation](#translation)
- [Themes](#themes)
- [Contributing](#contributing)
  - [How to Contribute](#how-to-contribute)
  - [Code Review Process](#code-review-process)
  - [Reporting Issues](#reporting-issues)
- [FAQ](#faq)
- [License](#license)

---

## Overview

YouTube Music is a free, open-source desktop wrapper for [YouTube Music](https://music.youtube.com/) built with Electron. It provides a native desktop experience with over 40 plugins that enhance functionality — including an ad blocker, Discord Rich Presence, audio equalizer, downloader, lyrics display, SponsorBlock support, and many more.

The app preserves YouTube Music's original interface while adding a powerful plugin system, custom themes, global keyboard shortcuts, MPRIS/Linux media key support, and cross-platform builds for Windows, macOS, and Linux.

## Features

- **Native desktop experience** — dedicated window with tray support, system notifications, taskbar media controls (Windows), and TouchBar (macOS)
- **Ad blocking** — built-in ad and tracker blocking via Ghostery
- **Plugin ecosystem** — 40+ plugins (see below) that can be enabled/disabled individually
- **Custom themes** — load custom CSS themes to personalize the look
- **Global shortcuts** — keyboard shortcuts and MPRIS support for Linux media keys
- **Cross-platform** — Windows (x64, ia32, arm64), macOS (x64, arm64), Linux (x64, arm64, armv7l)
- **Auto-updates** — automatic updates via electron-updater
- **Multi-language** — translated into 40+ languages via Weblate
- **No telemetry** — fully open-source, no tracking or analytics

## Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| Framework    | [Electron](https://www.electronjs.org/) 35                  |
| UI           | [SolidJS](https://www.solidjs.com/)                         |
| Build        | [electron-vite](https://electron-vite.org/) + [Vite](https://vitejs.dev/) 6 |
| Language     | [TypeScript](https://www.typescriptlang.org/) 5.8           |
| Package Mgr  | [pnpm](https://pnpm.io/) 10+                                |
| Styling      | CSS with `solid-styled-components`                          |
| Testing      | [Playwright](https://playwright.dev/)                       |
| Linting      | [ESLint](https://eslint.org/) 9 + [Prettier](https://prettier.io/) |
| I18n         | [i18next](https://www.i18next.com/) + [Weblate](https://hosted.weblate.org/engage/youtube-music/) |
| Bundling     | [electron-builder](https://www.electron.build/) 26          |

## Available Plugins

| Plugin                    | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Ad Blocker**            | Block all ads and tracking out of the box                          |
| **Album Actions**         | Apply Like/Dislike/Unlike/Undislike to all songs in a playlist     |
| **Album Color Theme**     | Dynamic theme and visual effects based on album color palette      |
| **Ambient Mode**          | Lighting effect with gentle colors from the video background       |
| **Audio Compressor**      | Apply compression to audio                                         |
| **Blur Navigation Bar**   | Transparent and blurry navigation bar                              |
| **Bypass Age Restrictions** | Bypass YouTube's age verification                                |
| **Captions Selector**     | Enable captions                                                    |
| **Compact Sidebar**       | Always set the sidebar in compact mode                             |
| **Crossfade**             | Crossfade between songs                                            |
| **Disable Autoplay**      | Start every song in "paused" mode                                  |
| **Discord Rich Presence** | Show what you listen to on Discord                                 |
| **Downloader**            | Download MP3 directly from the interface (youtube-dl)              |
| **Equalizer**             | Boost or cut specific frequency ranges (e.g. bass booster)         |
| **Exponential Volume**    | Exponential volume slider for finer low-volume control             |
| **In-App Menu**           | Dark, fancy application menu bar                                   |
| **Lumia Stream**          | Lumia Stream integration                                           |
| **Lyrics Genius**         | Lyrics support for most songs                                      |
| **Music Together**        | Share a playlist — everyone hears the same song as the host        |
| **Navigation**            | Next/Back navigation arrows in the interface                       |
| **No Google Login**       | Remove Google login buttons and links                              |
| **Notifications**         | Desktop notifications on song change (interactive on Windows)      |
| **Picture-in-picture**    | Switch the app to PiP mode                                         |
| **Playback Speed**        | Slider to control playback speed                                   |
| **Precise Volume**        | Mousewheel/hotkey volume control with customizable steps           |
| **Scrobbler**             | Scrobble to Last.fm and ListenBrainz                               |
| **Shortcuts (& MPRIS)**   | Global hotkeys, media key override, Linux MPRIS, custom hotkeys    |
| **Skip Disliked Song**    | Automatically skip disliked songs                                  |
| **Skip Silences**         | Automatically skip silenced sections                               |
| **SponsorBlock**          | Skip non-music parts (intro, outro, etc.)                          |
| **Synced Lyrics**         | Synced lyrics via LRClib and other providers                       |
| **Taskbar Media Control** | Windows taskbar playback controls                                  |
| **TouchBar**              | Custom TouchBar layout for macOS                                   |
| **Tuna OBS**              | Integration with OBS Tuna plugin                                   |
| **Video Quality Changer** | Change video quality from the video overlay                        |
| **Video Toggle**          | Switch between Video/Song mode, optionally remove the video tab    |
| **Visualizer**            | Music visualizers                                                  |

## Installation

### Prerequisites

- **Node.js** 18+ (recommended: latest LTS)
- **pnpm** 10+ (install via `npm install -g pnpm` or [other methods](https://pnpm.io/installation))

### From Releases

Download the latest installer or portable package from the [releases page](https://github.com/th-ch/youtube-music/releases/latest).

### Arch Linux

Install the [`youtube-music-bin`](https://aur.archlinux.org/packages/youtube-music-bin) AUR package:

```bash
yay -S youtube-music-bin
# or with any other AUR helper
```

### macOS

Install via Homebrew:

```bash
brew install th-ch/youtube-music/youtube-music
```

If you install manually and get **"is damaged and can’t be opened"**, run:

```bash
/usr/bin/xattr -cr /Applications/YouTube\ Music.app
```

### Windows

Using [Scoop](https://scoop.sh):

```bash
scoop bucket add extras
scoop install extras/youtube-music
```

Using [Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/):

```bash
winget install th-ch.YouTubeMusic
```

> **Note:** Microsoft Defender SmartScreen may block installation from an "unknown publisher". This is expected for open-source Electron apps.

#### Offline Installation (Windows)

1. Download the `*.nsis.7z` file matching your architecture from the [releases page](https://github.com/th-ch/youtube-music/releases/latest)
2. Download the `*-Setup.exe` installer
3. Place both files in the **same directory**
4. Run the installer

## Usage

### Running the App

After installation, launch YouTube Music from your application menu or run:

```bash
# If installed via package manager
youtube-music

# If running from source
pnpm start
```

### Configuration Options

Configuration is stored locally via [electron-store](https://github.com/sindresorhus/electron-store). You can change settings from the app's menu (Options) or edit the config file directly.

| Option                       | Type      | Default  | Description                                         |
| ---------------------------- | --------- | -------- | --------------------------------------------------- |
| `language`                   | `string`  | system   | UI language                                         |
| `tray`                       | `boolean` | `false`  | Minimize to system tray                             |
| `appVisible`                 | `boolean` | `true`   | Show app on launch                                  |
| `autoUpdates`                | `boolean` | `true`   | Auto-download updates                               |
| `alwaysOnTop`                | `boolean` | `false`  | Keep window on top                                  |
| `hideMenu`                   | `boolean` | `false`  | Hide the application menu bar                       |
| `startAtLogin`               | `boolean` | `false`  | Launch at system login                              |
| `disableHardwareAcceleration`| `boolean` | `false`  | Disable GPU acceleration                            |
| `removeUpgradeButton`        | `boolean` | `false`  | Remove "Upgrade to Music Premium" button            |
| `restartOnConfigChanges`     | `boolean` | `false`  | Auto-restart on config changes                      |
| `trayClickPlayPause`         | `boolean` | `false`  | Tray click toggles play/pause                       |
| `autoResetAppCache`          | `boolean` | `false`  | Reset app cache on startup                          |
| `resumeOnStart`              | `boolean` | `true`   | Resume playback from where you left off             |
| `proxy`                      | `string`  | `''`     | HTTP proxy URL                                      |
| `startingPage`               | `string`  | `''`     | Custom starting page                                |
| `overrideUserAgent`          | `boolean` | `false`  | Override the user agent                             |
| `usePodcastParticipantAsArtist` | `boolean` | `false` | Use podcast participant as artist name            |
| `themes`                     | `string[]`| `[]`     | List of CSS theme file paths                        |

### API Server

The built-in **API Server** plugin exposes a REST API (via [Hono](https://hono.dev/)) for controlling playback, managing the queue, and retrieving song info. Enable the plugin from the Options menu, then access the API at `http://localhost:9863` (configurable). Swagger UI documentation is available at the same endpoint.

## Project Structure

```
youtube-music/
├── src/
│   ├── config/           # App configuration (defaults, store, plugin config)
│   ├── i18n/             # Internationalization resources (40+ languages)
│   ├── loader/           # Module loaders for plugins and menu
│   ├── plugins/          # 40+ feature plugins
│   │   ├── adblocker/    # Ad blocking plugin
│   │   ├── downloader/   # MP3 downloader plugin
│   │   ├── discord/      # Discord Rich Presence
│   │   ├── sponsorblock/ # SponsorBlock integration
│   │   └── ...           # All other plugins
│   ├── providers/        # Services (app controls, song info, protocol handler, etc.)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Shared utilities and testing helpers
│   ├── index.ts          # Main process entry point
│   ├── preload.ts        # Preload script for renderer
│   ├── renderer.ts       # Renderer process entry
│   ├── menu.ts           # Application menu builder
│   └── tray.ts           # System tray setup
├── tests/                # Playwright integration tests
├── vite-plugins/         # Custom Vite plugin modules
├── assets/               # App icons and resources
├── web/                  # Web assets (SVGs, screenshots)
├── docs/                 # Additional documentation and readme translations
├── patches/              # pnpm patch files
├── electron.vite.config.mts  # electron-vite configuration
├── eslint.config.mjs     # ESLint configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project metadata and scripts
```

## Development

### Prerequisites

- **Node.js** 18+ (engines field: `>=18`)
- **pnpm** 10+ (engines field: `>=10`)

### Setup

```bash
git clone https://github.com/th-ch/youtube-music
cd youtube-music
pnpm install --frozen-lockfile
```

### Dev Workflow

```bash
# Start development with hot reload
pnpm dev

# Debug mode with logging
pnpm dev:debug

# Renderer-only dev (no Electron relaunch on main process changes)
pnpm dev:renderer
```

The dev server starts at `https://music.youtube.com` with all plugins loaded. Changes to `src/` are hot-reloaded.

### Build

Build distributable packages for your platform:

```bash
pnpm dist:win        # Windows (x64, ia32, arm64)
pnpm dist:linux      # Linux (amd64)
pnpm dist:mac        # macOS (amd64)
pnpm dist:mac:arm64  # macOS (Apple Silicon)
```

Platform-specific Linux builds:

```bash
pnpm dist:linux:deb-arm64    # Debian arm64
pnpm dist:linux:rpm-arm64    # Fedora arm64
```

Output goes to `./pack/`.

### Production Preview

```bash
pnpm start
```

### Testing

```bash
pnpm test
```

Tests use [Playwright](https://playwright.dev/) to launch the Electron app and verify the UI loads YouTube Music correctly.

### Code Style & Linting

```bash
# Lint all files
pnpm lint

# Check TypeScript types
pnpm typecheck
```

This project uses:

- **[ESLint](https://eslint.org/)** 9 with `typescript-eslint` for linting
- **[Prettier](https://prettier.io/)** via `eslint-plugin-prettier` for formatting
- **EditorConfig** (see `.editorconfig`): 2-space indentation, LF line endings, UTF-8

Rule highlights (from `eslint.config.mjs`):
- Arrow parentheses required: `(x) => x`
- Import ordering enforced
- TypeScript strict mode enabled

### Type Checking

```bash
pnpm typecheck
```

TypeScript is configured with strict mode enabled (`strict: true`). The project uses `solid-js` JSX with the `solid` JSX import source.

## Creating Plugins

Using plugins, you can:

- Manipulate the app — the Electron `BrowserWindow` is passed to the plugin handler
- Change the frontend by manipulating HTML/CSS/DOM

### Creating a Plugin

Create a folder in `src/plugins/YOUR-PLUGIN-NAME` with an `index.ts` file:

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

**Main–renderer IPC communication:** Use `ipc.handle()` in `backend.start()` and `context.ipc.invoke()` in the renderer. See the `sponsorblock` plugin for a complete example.

## Translation

Help translate YouTube Music into your language on [Hosted Weblate](https://hosted.weblate.org/projects/youtube-music/).

<a href="https://hosted.weblate.org/engage/youtube-music/">
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/multi-auto.svg" alt="translation status" />
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/287x66-black.png" alt="translation status 2" />
</a>

## Themes

Load custom CSS themes from **Options > Visual Tweaks > Themes**. A collection of community themes is available at [kerichdev/themes-for-ytmdesktop-player](https://github.com/kerichdev/themes-for-ytmdesktop-player).

## Contributing

### How to Contribute

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feat/my-feature`
3. **Make your changes** following the code style guide
4. **Run linting and type checking**: `pnpm lint && pnpm typecheck`
5. **Run tests**: `pnpm test`
6. **Commit** using conventional commit messages
7. **Push** and open a Pull Request

### Code Review Process

- All changes must go through pull requests — no direct commits to `master`
- At least one maintainer review is required
- CI checks (lint, typecheck, build) must pass
- Plugins should include tests when adding new functionality
- Keep PRs focused on a single concern

### Reporting Issues

- **Bug reports**: Use the [Bug Report template](https://github.com/th-ch/youtube-music/issues/new?template=bug_report.yml). Include your app version, OS, CPU architecture, enabled plugins, and reproduction steps.
- **Feature requests**: Use the [Feature Request template](https://github.com/th-ch/youtube-music/issues/new?template=feature_request.yml). Describe the problem, your proposed solution, and alternatives considered.

Before filing, please:
1. Use the [latest version](https://github.com/th-ch/youtube-music/releases/latest) of the app
2. Search existing [issues](https://github.com/th-ch/youtube-music/issues) for duplicates
3. Check if the issue reproduces in the [official YouTube Music web version](https://music.youtube.com)

## FAQ

### Why isn't the app menu showing up?

If the **Hide Menu** option is enabled, show the menu with the <kbd>alt</kbd> key (or <kbd>\`</kbd> backtick if using the In-App Menu plugin). See [this discussion](https://github.com/th-ch/youtube-music/issues/410#issuecomment-952060709) for more details.

## License

MIT © [th-ch](https://github.com/th-ch/youtube-music)