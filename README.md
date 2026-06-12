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

Read this in other languages: [🇰🇷](./docs/readme/README-ko.md), [🇫🇷](./docs/readme/README-fr.md), [🇮🇸](./docs/readme/README-is.md), [🇨🇱 🇪🇸](./docs/readme/README-es.md), [🇷🇺](./docs/readme/README-ru.md), [🇭🇺](./docs/readme/README-hu.md)

## Project Overview

**YouTube Music** is an Electron wrapper around [YouTube Music](https://music.youtube.com/) that delivers a native desktop experience with a plugin framework for customization. It preserves the original web interface while adding desktop-native features, keyboard shortcuts, media integration, and an extensible plugin system.

### Key Features

- **Native desktop experience** — Runs as a standalone app with system tray integration, media keys, and notifications
- **Plugin framework** — Extend functionality with custom plugins for style, content, and features (toggle on/off with one click)
- **Ad blocking** — Built-in ad blocker blocks all ads and tracking out of the box
- **Audio enhancements** — Equalizer, crossfade, audio compressor, playback speed control, precise volume
- **Integrations** — Discord Rich Presence, Last.fm/ListenBrainz scrobbling, OBS (Tuna), Lumia Stream, MPRIS
- **Visual customization** — Album color themes, ambient mode, visualizers, custom CSS themes
- **Downloader** — Download MP3 directly from the interface
- **Cross-platform** — Available for Windows, macOS, and Linux

### Tech Stack

| Layer       | Technology                                                         |
|-------------|--------------------------------------------------------------------|
| Framework   | [Electron](https://www.electronjs.org/) 35                         |
| UI          | [SolidJS](https://www.solidjs.com/) 1.9 (renderer)                 |
| Build       | [electron-vite](https://electron-vite.org/) 3.1 / Vite 6.2         |
| Language    | TypeScript 5.8                                                     |
| Linting     | ESLint 9 + Prettier                                                |
| Testing     | [Playwright](https://playwright.dev/) 1.51                         |
| Packaging   | [electron-builder](https://www.electron.build/) 26                 |
| Package Mgr | pnpm 10+                                                           |

## Content

- [Project Overview](#project-overview)
- [Features](#features)
- [Available plugins](#available-plugins)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Download (prebuilt binaries)](#download-prebuilt-binaries)
  - [Build from source](#build-from-source)
- [Usage](#usage)
  - [Basic usage](#basic-usage)
  - [Configuration](#configuration)
- [Development](#development)
  - [Project structure](#project-structure)
  - [Development workflow](#development-workflow)
  - [Testing](#testing)
  - [Code style](#code-style)
- [Build your own plugins](#build-your-own-plugins)
  - [Creating a plugin](#creating-a-plugin)
  - [Common use cases](#common-use-cases)
- [Themes](#themes)
- [Translation](#translation)
- [Contributing](#contributing)
  - [How to contribute](#how-to-contribute)
  - [Code review process](#code-review-process)
  - [Issue reporting](#issue-reporting)
- [FAQ](#faq)
- [License](#license)

---

## Features

- **Auto confirm when paused** (Always Enabled): disable the ["Continue Watching?"](https://user-images.githubusercontent.com/61631665/129977894-01c60740-7ec6-4bf0-9a2c-25da24491b0e.png) popup that pauses music after a certain time
- **Native OS integration**: system tray, taskbar media control (Windows), TouchBar (macOS), MPRIS (Linux)
- **Global shortcuts**: customizable hotkeys for play/pause/next/previous/search
- **Auto-updater**: automatic updates via electron-updater
- **And more...**

## Available plugins

- **Ad Blocker**: Block all ads and tracking out of the box

- **Album Actions**: Adds Undislike, Dislike, Like, and Unlike buttons to apply these to all songs in a playlist or album

- **Album Color Theme**: Applies a dynamic theme and visual effects based on the album color palette

- **Ambient Mode**: Applies a lighting effect by casting gentle colors from the video into your screen's background

- **Audio Compressor**: Apply compression to audio (lowers the volume of the loudest parts and raises the volume of the softest parts)

- **Blur Navigation Bar**: Makes navigation bar transparent and blurry

- **Bypass Age Restrictions**: Bypass YouTube's age verification

- **Captions Selector**: Enable captions

- **Compact Sidebar**: Always set the sidebar in compact mode

- **Crossfade**: Crossfade between songs

- **Disable Autoplay**: Makes every song start in "paused" mode

- **[Discord](https://discord.com/) Rich Presence**: Show your friends what you listen to with [Rich Presence](https://user-images.githubusercontent.com/28219076/104362104-a7a0b980-5513-11eb-9744-bb89eabe0016.png)

- **Downloader**: Download MP3 [directly from the interface](https://user-images.githubusercontent.com/61631665/129977677-83a7d067-c192-45e1-98ae-b5a4927393be.png) (youtube-dl)

- **Equalizer**: Add filters to boost or cut specific frequency ranges (e.g. bass booster)

- **Exponential Volume**: Makes the volume slider [exponential](https://greasyfork.org/en/scripts/397686-youtube-music-fix-volume-ratio/) for easier low-volume selection

- **In-App Menu**: [Gives bars a fancy, dark look](https://user-images.githubusercontent.com/78568641/112215894-923dbf00-8c29-11eb-95c3-3ce15db27eca.png)

  > (See [this post](https://github.com/th-ch/youtube-music/issues/410#issuecomment-952060709) if you have trouble accessing the menu after enabling this plugin and the hide-menu option)

- **Scrobbler**: Scrobbling support for [Last.fm](https://www.last.fm/) and [ListenBrainz](https://listenbrainz.org/)

- **Lumia Stream**: [Lumia Stream](https://lumiastream.com/) support

- **Lyrics Genius**: Lyrics support for most songs

- **Music Together**: Share a playlist with others — when the host plays a song, everyone else hears the same song

- **Navigation**: Next/Back navigation arrows integrated in the interface

- **No Google Login**: Remove Google login buttons and links from the interface

- **Notifications**: Display a notification when a song starts playing ([interactive notifications](https://user-images.githubusercontent.com/78568641/114102651-63ce0e00-98d0-11eb-9dfe-c5a02bb54f9c.png) on Windows)

- **Picture-in-picture**: Switch the app to picture-in-picture mode

- **Playback Speed**: [Adds a slider that controls song speed](https://user-images.githubusercontent.com/61631665/129976003-e55db5ba-bf42-448c-a059-26a009775e68.png)

- **Precise Volume**: Control volume precisely using mousewheel/hotkeys with a custom HUD and customizable volume steps

- **Shortcuts (& MPRIS)**: Global hotkeys for playback (play/pause/next/previous) + disable [media OSD](https://user-images.githubusercontent.com/84923831/128601225-afa38c1f-dea8-4209-9f72-0f84c1dd8b54.png) by overriding media keys + Ctrl/CMD+F to search + Linux MPRIS support + [custom hotkeys](https://github.com/Araxeus/youtube-music/blob/1e591d6a3df98449bcda6e63baab249b28026148/providers/song-controls.js#L13-L50) for [advanced users](https://github.com/th-ch/youtube-music/issues/106#issuecomment-952156902)

- **Skip Disliked Song**: Skips disliked songs automatically

- **Skip Silences**: Automatically skip silenced sections

- [**SponsorBlock**](https://github.com/ajayyy/SponsorBlock): Automatically skip non-music parts like intros/outros

- **Synced Lyrics**: Synced lyrics using providers like [LRClib](https://lrclib.net)

- **Taskbar Media Control**: Control playback from your [Windows taskbar](https://user-images.githubusercontent.com/78568641/111916130-24a35e80-8a82-11eb-80c8-5021c1aa27f4.png)

- **TouchBar**: Custom TouchBar layout for macOS

- **Tuna OBS**: Integration with [OBS](https://obsproject.com/)'s [Tuna](https://obsproject.com/forum/resources/tuna.843/) plugin

- **Video Quality Changer**: Change video quality with a [button](https://user-images.githubusercontent.com/78568641/138574366-70324a5e-2d64-4f6a-acdd-dc2a2b9cecc5.png) on the video overlay

- **Video Toggle**: [Button](https://user-images.githubusercontent.com/28893833/173663950-63e6610e-a532-49b7-9afa-54cb57ddfc15.png) to switch between Video/Song mode; optionally remove the video tab entirely

- **Visualizer**: Different music visualizers

---

## Installation

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 ([installation guide](https://pnpm.io/installation))
- **Git**

### Download (prebuilt binaries)

You can check out the [latest release](https://github.com/th-ch/youtube-music/releases/latest) to find the latest version.

#### Arch Linux

Install the [`youtube-music-bin`](https://aur.archlinux.org/packages/youtube-music-bin) package from the AUR. For AUR installation instructions, take a look at this [wiki page](https://wiki.archlinux.org/index.php/Arch_User_Repository#Installing_packages).

#### macOS

Install using Homebrew (see the [cask definition](https://github.com/th-ch/homebrew-youtube-music)):

```bash
brew install th-ch/youtube-music/youtube-music
```

If you get an error "is damaged and can't be opened." when launching, run:

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

> **Note:** Microsoft Defender SmartScreen might block the installation since it is from an "unknown publisher."

##### Install without a network connection (Windows)

1. Download the `*.nsis.7z` file for your device architecture from the [release page](https://github.com/th-ch/youtube-music/releases/latest) (`x64`, `ia32`, or `arm64`)
2. Download the installer (`*-Setup.exe`)
3. Place both in the **same directory**
4. Run the installer

### Build from source

```bash
# Clone the repository
git clone https://github.com/th-ch/youtube-music
cd youtube-music

# Install dependencies
pnpm install --frozen-lockfile

# Build for your platform
pnpm dist:linux   # Linux (amd64)
pnpm dist:win     # Windows
pnpm dist:mac     # macOS (amd64)
pnpm dist:mac:arm64   # macOS (arm64)
```

---

## Usage

### Basic usage

After installation, launch YouTube Music from your application menu. The app opens YouTube Music's web interface wrapped in a native window with desktop integration.

**Keyboard shortcuts** (when Shortcuts plugin is enabled):
- `MediaPlayPause` — Play/Pause
- `MediaNextTrack` — Next track
- `MediaPreviousTrack` — Previous track
- `Ctrl/Cmd + F` — Search
- `Alt` — Show menu (when menu is hidden)

### Configuration

Access configuration via the app menu (or <kbd>alt</kbd> if hidden). You can:

- **Enable/disable plugins** — Toggle any plugin on/off from the Plugins menu
- **Load custom themes** — CSS files under Options > Visual Tweaks > Themes
- **Configure individual plugins** — Each plugin may expose its own settings (e.g., volume step size, crossfade duration)
- **Hide menu bar** — Enable the hide-menu option for a cleaner interface

---

## Development

### Project structure

```
youtube-music/
├── src/
│   ├── index.ts            # Main process entry point
│   ├── preload.ts          # Preload script (context bridge)
│   ├── renderer.ts         # Renderer process entry
│   ├── index.html          # HTML shell
│   ├── menu.ts             # Application menu definition
│   ├── tray.ts             # System tray integration
│   ├── config/             # Configuration management
│   ├── i18n/               # Internationalization
│   ├── plugins/            # All built-in plugins
│   │   ├── adblocker/
│   │   ├── downloader/
│   │   ├── equalizer/
│   │   ├── ...             # 40+ plugins
│   │   └── utils/          # Plugin utilities
│   ├── providers/          # Media providers
│   ├── types/              # TypeScript type declarations
│   └── utils/              # Shared utilities
├── assets/                 # Icons and static resources
├── tests/                  # Playwright end-to-end tests
├── docs/                   # Documentation site
├── patches/                # pnpm patch files
├── vite-plugins/           # Custom Vite plugins
├── web/                    # Web assets (screenshots, images)
├── electron.vite.config.mts  # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
└── package.json            # Dependencies and scripts
```

### Development workflow

```bash
# Start development mode (with hot reload)
pnpm dev

# Start with debug logging
pnpm dev:debug

# Run renderer dev server only (without main process)
pnpm dev:renderer

# Type-check the project
pnpm typecheck

# Lint all files
pnpm lint

# Preview production build
pnpm build && pnpm start
```

The `pnpm dev` command starts the app in development mode with:
- Hot module replacement (HMR) for the renderer process
- Source maps for debugging
- DevTools available via `F12` or the View menu

### Testing

```bash
# Run all tests
pnpm test

# Run tests with debug output
pnpm test:debug
```

Tests use [Playwright](https://playwright.dev/) for end-to-end testing. Test files are located in the `tests/` directory.

### Code style

This project uses:
- **[ESLint 9](https://eslint.org/)** with flat config (`eslint.config.mjs`) for linting
- **[Prettier](https://prettier.io/)** (via `.prettierrc`) for formatting
- **[EditorConfig](https://editorconfig.org/)** (`.editorconfig`) for basic editor settings:
  - 2-space indentation
  - UTF-8 charset
  - LF line endings
  - Trailing whitespace trimmed
  - Final newline inserted

Run the linter before committing:

```bash
pnpm lint
```

---

## Build your own plugins

Using plugins, you can:

- Manipulate the app — the `BrowserWindow` from Electron is passed to the plugin handler
- Change the frontend by manipulating HTML/CSS

### Creating a plugin

Create a folder in `src/plugins/YOUR-PLUGIN-NAME`:

- `index.ts`: the main file of the plugin

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

### Common use cases

- **Injecting custom CSS:** Create a `style.css` file in the same folder:

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

- **Changing the HTML:**

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

- **Communicating between frontend and backend:** Use Electron's `ipcMain`/`ipcRenderer` modules. See the `sponsorblock` plugin for an example.

---

## Themes

You can load CSS files to change the look of the application (Options > Visual Tweaks > Themes).

Some predefined themes are available at [kerichdev/themes-for-ytmdesktop-player](https://github.com/kerichdev/themes-for-ytmdesktop-player).

---

## Translation

Help translate the app on [Hosted Weblate](https://hosted.weblate.org/projects/youtube-music/).

<a href="https://hosted.weblate.org/engage/youtube-music/">
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/multi-auto.svg" alt="translation status" />
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/287x66-black.png" alt="translation status 2" />
</a>

---

## Contributing

### How to contribute

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feat/your-feature-name`
3. **Make your changes** following the code style guidelines
4. **Test your changes**: `pnpm lint` and `pnpm typecheck`
5. **Commit** using a descriptive message
6. **Push** to your fork and **submit a pull request**

### Code review process

- All changes must go through pull requests and be reviewed by maintainers
- Ensure your code passes `pnpm lint` and `pnpm typecheck` before requesting a review
- Address review feedback promptly
- Keep pull requests focused on a single concern — avoid unrelated changes

### Issue reporting

- **Bug reports**: Use the [bug report template](https://github.com/th-ch/youtube-music/issues/new?template=bug_report.yml)
- **Feature requests**: Use the [feature request template](https://github.com/th-ch/youtube-music/issues/new?template=feature_request.yml)
- Check existing issues before creating a new one
- Include detailed steps to reproduce bugs

---

## FAQ

### Why isn't the app's menu showing up?

If the `Hide Menu` option is on — you can show the menu with the <kbd>alt</kbd> key (or <kbd>\`</kbd> (backtick) if using the in-app-menu plugin).

---

## License

MIT © [th-ch](https://github.com/th-ch/youtube-music) — See the [license](license) file for details.