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

**Electron wrapper around YouTube Music featuring:**

- Native look & feel, aims at keeping the original interface
- Framework for custom plugins: change YouTube Music to your needs (style, content, features), enable/disable plugins in one click

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Download Prebuilt Binaries](#download-prebuilt-binaries)
  - [Package Managers](#package-managers)
  - [Build from Source](#build-from-source)
- [Usage](#usage)
  - [Getting Started](#getting-started)
  - [Configuration](#configuration)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Development Workflow](#development-workflow)
  - [Testing](#testing)
  - [Code Style](#code-style)
- [Plugins](#plugins)
  - [Available Plugins](#available-plugins)
  - [Building Custom Plugins](#building-custom-plugins)
- [Contributing](#contributing)
- [License](#license)
- [FAQ](#faq)
- [Credits](#credits)

---

## Project Overview

YouTube Music is an open-source, cross-platform desktop application that wraps [YouTube Music](https://music.youtube.com) in an [Electron](https://www.electronjs.org/) shell. It provides a native desktop experience while preserving the familiar web interface, and includes a powerful plugin system that lets users customize functionality to their liking.

### Key Features

- **Native Desktop Experience** — Runs as a standalone app on Windows, macOS, and Linux with native menus, tray integration, and window controls
- **Plugin Framework** — Enable, disable, and configure plugins on the fly without rebuilding the app
- **Ad Blocking** — Built-in ad and tracker blocking out of the box
- **Media Integration** — MPRIS support on Linux, TouchBar on macOS, taskbar controls on Windows
- **Rich Ecosystem** — 35+ plugins for lyrics, Discord presence, downloads, visualizers, and more
- **Cross-Platform Builds** — Distributed as AppImage, DEB, RPM, Snap, Flatpak, DMG, NSIS, and portable executables
- **Automatic Updates** — Optional auto-updater powered by electron-updater
- **Multi-Language** — Internationalization support with community-driven translations via Weblate

### Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | [Electron](https://www.electronjs.org/) 35 |
| Build Tool | [electron-vite](https://electron-vite.org/) 3 |
| Bundler | [Vite](https://vitejs.dev/) 6 |
| Frontend Framework | [SolidJS](https://www.solidjs.com/) 1.9 |
| Language | [TypeScript](https://www.typescriptlang.org/) 5.8 |
| Package Manager | [pnpm](https://pnpm.io/) 10 |
| Testing | [Playwright](https://playwright.dev/) 1.51 |
| Linting | [ESLint](https://eslint.org/) 9 + [Prettier](https://prettier.io/) |
| CSS Preprocessing | Inline CSS / Custom themes |

---

## Features

- **Auto confirm when paused** (Always Enabled): disable the ["Continue Watching?"](https://user-images.githubusercontent.com/61631665/129977894-01c60740-7ec6-4bf0-9a2c-25da24491b0e.png) popup that pauses music after a certain time
- And more via plugins ...

## Installation

### Prerequisites

Before installing or building the project, ensure you have the following installed:

- **Node.js** >= 18 (recommended: 20.x)
- **pnpm** >= 10
- **Git**

> For Linux builds, additional system dependencies may be required depending on the target format (e.g., `flatpak-builder` for Flatpak).

### Download Prebuilt Binaries

The easiest way to get started is to download a prebuilt release for your platform from the [Releases page](https://github.com/th-ch/youtube-music/releases/latest).

### Package Managers

#### Arch Linux

Install the [`youtube-music-bin`](https://aur.archlinux.org/packages/youtube-music-bin) package from the AUR. For AUR installation instructions, take a look at this [wiki page](https://wiki.archlinux.org/index.php/Arch_User_Repository#Installing_packages).

#### macOS

You can install the app using Homebrew (see the [cask definition](https://github.com/th-ch/homebrew-youtube-music)):

```bash
brew install th-ch/youtube-music/youtube-music
```

If you install the app manually and get an error "is damaged and can't be opened." when launching the app, run the following in the Terminal:

```bash
/usr/bin/xattr -cr /Applications/YouTube\ Music.app
```

#### Windows

You can use the [Scoop package manager](https://scoop.sh) to install the `youtube-music` package from the [`extras` bucket](https://github.com/ScoopInstaller/Extras).

```bash
scoop bucket add extras
scoop install extras/youtube-music
```

Alternately you can use [Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/), Windows 11's official CLI package manager to install the `th-ch.YouTubeMusic` package.

> **Note:** Microsoft Defender SmartScreen might block the installation since it is from an "unknown publisher". This is also true for the manual installation when trying to run the executable (.exe) after a manual download here on GitHub (same file).

```bash
winget install th-ch.YouTubeMusic
```

##### How to install without a network connection? (in Windows)

- Download the `*.nsis.7z` file for _your device architecture_ in the [release page](https://github.com/th-ch/youtube-music/releases/latest).
  - `x64` for 64-bit Windows
  - `ia32` for 32-bit Windows
  - `arm64` for ARM64 Windows
- Download the installer from the release page (`*-Setup.exe`).
- Place them in the **same directory**.
- Run the installer.

### Build from Source

1. Clone the repository:

```bash
git clone https://github.com/th-ch/youtube-music.git
cd youtube-music
```

2. Install `pnpm` if you haven't already. See the [pnpm installation guide](https://pnpm.io/installation).

3. Install dependencies:

```bash
pnpm install --frozen-lockfile
```

4. Start the development server (see [Development](#development)) or build for production:

```bash
# Production build for current platform
pnpm dist

# Or target a specific OS
pnpm dist:win      # Windows
pnpm dist:linux    # Linux (x64)
pnpm dist:mac      # macOS (x64)
pnpm dist:mac:arm64 # macOS (Apple Silicon)
```

Build artifacts will be output to the `./pack/` directory.

---

## Usage

### Getting Started

After installing, launch the application. The first time you run it, you will see the YouTube Music web interface loaded inside the app window.

- Use the **application menu** (or press <kbd>Alt</kbd> on Windows/Linux) to access plugins and options.
- Right-click the **tray icon** (if enabled) to control playback or show/hide the window.
- Use **media keys** on your keyboard to control playback (play/pause, next, previous) — automatically supported via the Shortcuts plugin.

### Configuration

Configuration is stored persistently using `electron-store` and can be accessed through:

- **Menu > Options** — Toggle auto-updates, always-on-top, tray behavior, language, visual tweaks, and more.
- **Menu > Options > Advanced Options** — Set proxy, override user agent, disable hardware acceleration, edit config JSON directly, or toggle developer tools.
- **Menu > Plugins** — Enable or disable individual plugins. Some plugins expose their own submenu options when enabled.

#### Key Options

| Option | Description |
|--------|-------------|
| `tray` | Minimize to system tray instead of closing |
| `autoUpdates` | Automatically check for and notify about updates |
| `alwaysOnTop` | Keep the window above all others |
| `resumeOnStart` | Remember and restore the last page on launch |
| `hideMenu` | Hide the application menu bar (press <kbd>Alt</kbd> to show) |
| `themes` | Load custom CSS files to override the app appearance |

### Keyboard Shortcuts

The Shortcuts plugin (enabled by default) allows you to configure global hotkeys for playback control. It also provides:

- **Ctrl/Cmd + F** — Focus the YouTube Music search bar
- **Media Keys** — Play/Pause, Next, Previous (system-wide)
- **Custom hotkeys** — Configure your own bindings via the plugin menu

---

## Development

### Project Structure

```
youtube-music/
├── assets/               # Static assets (icons, HTML, images)
├── docs/                 # Documentation and website assets
├── src/
│   ├── config/           # App configuration and defaults
│   ├── i18n/             # Translation resources
│   ├── loader/           # Plugin loading orchestration
│   ├── plugins/          # All built-in plugins (one folder per plugin)
│   ├── providers/        # Shared provider modules (song info, app controls, etc.)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Shared utilities
│   ├── index.html        # Renderer entry HTML
│   ├── index.ts          # Main process entry
│   ├── menu.ts           # Application menu definition
│   ├── preload.ts        # Preload script
│   ├── renderer.ts       # Renderer process entry
│   └── tray.ts           # System tray integration
├── tests/                # Playwright end-to-end tests
├── vite-plugins/         # Custom Vite plugins (plugin importer, i18n importer)
├── package.json
├── electron.vite.config.mts
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

### Development Workflow

1. **Install dependencies:**

```bash
pnpm install --frozen-lockfile
```

2. **Run in development mode** (with hot reload):

```bash
pnpm dev
```

This starts the Electron app with the Vite dev server, enabling live reloading for renderer changes.

3. **Run only the renderer dev server** (useful for front-end debugging):

```bash
pnpm dev:renderer
```

4. **Production preview** (test the built app locally):

```bash
pnpm build
pnpm start
```

5. **Debug mode** (enables Electron logging):

```bash
pnpm dev:debug
# or
pnpm start:debug
```

### Testing

Tests are written and executed using [Playwright](https://playwright.dev/):

```bash
# Run tests
pnpm test

# Run tests with debug logging
pnpm test:debug
```

The test suite launches the Electron application and verifies that it starts correctly and loads the YouTube Music URL.

### Code Style

This project uses **ESLint** with **TypeScript**, **Prettier**, and **Stylistic** plugins. Before submitting changes, ensure your code passes linting:

```bash
pnpm lint
```

Key style rules:

- Single quotes for strings
- Semicolons required
- 2-space indentation
- Trailing commas
- Arrow functions must always use parentheses
- Import order: built-in > external > internal/sibling > parent > type

---

## Plugins

### Available Plugins

| Plugin | Description |
|--------|-------------|
| **Ad Blocker** | Block all ads and tracking out of the box |
| **Album Actions** | Adds Undislike, Dislike, Like, and Unlike buttons for albums/playlists |
| **Album Color Theme** | Dynamic theme and visual effects based on the album color palette |
| **Ambient Mode** | Lighting effect casting gentle colors from the video into the screen background |
| **Audio Compressor** | Lowers volume of loudest parts and raises softest parts |
| **Blur Navigation Bar** | Makes the navigation bar transparent and blurry |
| **Bypass Age Restrictions** | Bypass YouTube's age verification |
| **Captions Selector** | Enable captions |
| **Compact Sidebar** | Always set the sidebar in compact mode |
| **Crossfade** | Crossfade between songs |
| **Disable Autoplay** | Makes every song start in "paused" mode |
| **Discord Rich Presence** | Show friends what you listen to via Discord |
| **Downloader** | Download MP3 directly from the interface |
| **Equalizer** | Boost or cut specific frequency ranges (e.g., bass booster) |
| **Exponential Volume** | Makes the volume slider exponential for finer low-volume control |
| **In-App Menu** | Gives the menu bar a fancy, dark look |
| **Last.fm / ListenBrainz Scrobbler** | Scrobble your listens |
| **Lumia Stream** | Adds Lumia Stream support |
| **Lyrics Genius** | Lyrics support for most songs |
| **Music Together** | Share a playlist so others hear the same song in sync |
| **Navigation** | Next/Back navigation arrows in the interface |
| **No Google Login** | Remove Google login buttons and links |
| **Notifications** | Display desktop notifications when a song starts playing |
| **Picture-in-Picture** | Switch the app to picture-in-picture mode |
| **Playback Speed** | Slider to control song playback speed |
| **Precise Volume** | Control volume precisely with mousewheel/hotkeys and a custom HUD |
| **Shortcuts (& MPRIS)** | Global hotkeys for playback + MPRIS integration on Linux |
| **Skip Disliked Song** | Automatically skip disliked songs |
| **Skip Silences** | Automatically skip silent sections |
| **SponsorBlock** | Skip non-music parts like intros and outros |
| **Synced Lyrics** | Provides synced lyrics from providers like LRClib |
| **Taskbar Media Control** | Control playback from the Windows taskbar |
| **TouchBar** | Custom TouchBar layout for macOS |
| **Tuna OBS** | Integration with OBS's Tuna plugin |
| **Video Quality Changer** | Change video quality via an overlay button |
| **Video Toggle** | Switch between Video/Song mode |
| **Visualizer** | Different music visualizers |

### Building Custom Plugins

Using plugins, you can manipulate the app (the `BrowserWindow` from Electron is passed to the plugin handler) and change the front end by manipulating HTML/CSS.

#### Creating a Plugin

Create a folder in `src/plugins/YOUR-PLUGIN-NAME`:

- `index.ts`: the main file of the plugin

```typescript
import style from './style.css?inline'; // import style as inline

import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Plugin Label',
  restartNeeded: true, // if true, ytmusic shows restart dialog
  config: {
    enabled: false,
  }, // your custom config
  stylesheets: [style], // your custom style,
  menu: async ({ getConfig, setConfig }) => {
    // All *Config methods are wrapped Promise<T>
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

      // you can communicate with renderer plugin
      ipc.handle('some-event', () => {
        return 'hello';
      });
    },
    // it fired when config changed
    onConfigChange(newConfig) { /* ... */ },
    // it fired when plugin disabled
    stop(context) { /* ... */ },
  },
  renderer: {
    async start(context) {
      console.log(await context.ipc.invoke('some-event'));
    },
    // Only renderer available hook
    onPlayerApiReady(api: YoutubePlayer, context: RendererContext) {
      // set plugin config easily
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

#### Common Use Cases

**Injecting custom CSS:**

Create a `style.css` file in the same folder, then:

```typescript
// index.ts
import style from './style.css?inline'; // import style as inline

import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Plugin Label',
  restartNeeded: true,
  config: {
    enabled: false,
  },
  stylesheets: [style], // your custom style
  renderer() {} // define renderer hook
});
```

**Changing HTML:**

```typescript
import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Plugin Label',
  restartNeeded: true,
  config: {
    enabled: false,
  },
  renderer() {
    // Remove the login button
    document.querySelector(".sign-in-link.ytmusic-nav-bar").remove();
  }
});
```

**Communicating between front and back:**

Can be done using the `ipcMain` module from Electron. See the `index.ts` file and the `sponsorblock` plugin for an example.

### Themes

You can load CSS files to change the look of the application (Options > Visual Tweaks > Themes).

Some predefined themes are available at [themes-for-ytmdesktop-player](https://github.com/kerichdev/themes-for-ytmdesktop-player).

---

## Contributing

We welcome contributions from the community! Here's how to get involved:

### How to Contribute

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR-USERNAME/youtube-music.git
cd youtube-music
```

3. **Create a branch** for your changes:

```bash
git checkout -b feature/my-new-feature
```

4. **Make your changes** following the existing code style.
5. **Run tests and linting** to ensure nothing is broken:

```bash
pnpm lint
pnpm test
```

6. **Commit your changes** with a clear, descriptive message.
7. **Push to your fork** and open a **Pull Request** on the main repository.

### Code Review Process

- All pull requests are reviewed by maintainers before merging.
- Ensure CI checks (build + tests) pass on your PR.
- Address review feedback promptly and keep the PR focused on a single concern.

### Issue Reporting

If you find a bug or have a feature request:

1. Search existing [issues](https://github.com/th-ch/youtube-music/issues) to avoid duplicates.
2. Open a new issue with a clear title and description.
3. Include steps to reproduce, expected vs. actual behavior, and your environment (OS, app version).
4. Attach screenshots or logs if applicable.

### Translation

You can help with translation on [Hosted Weblate](https://hosted.weblate.org/projects/youtube-music/).

<a href="https://hosted.weblate.org/engage/youtube-music/">
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/multi-auto.svg" alt="translation status" />
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/287x66-black.png" alt="translation status 2" />
</a>

---

## License

MIT © [th-ch](https://github.com/th-ch/youtube-music)

See [license](license) for full details.

---

## FAQ

### Why isn't the app menu showing up?

If `Hide Menu` option is on, you can show the menu with the <kbd>Alt</kbd> key (or <kbd>`</kbd> [backtick] if using the in-app-menu plugin).

### Why does Windows Defender warn me about the installer?

Microsoft Defender SmartScreen may block the installation because the app is from an "unknown publisher". This is expected for manually downloaded executables and does not indicate malware. You can safely click "More info" and "Run anyway" if you downloaded the file from our official GitHub releases.

### How do I reset the app configuration?

Go to **Menu > Options > Advanced Options > Edit Config JSON** and modify values directly, or delete the app's config directory to reset to defaults:

- **Windows:** `%APPDATA%\youtube-music\`
- **macOS:** `~/Library/Application Support/youtube-music/`
- **Linux:** `~/.config/youtube-music/`

### Can I use my own CSS themes?

Yes! Go to **Options > Visual Tweaks > Themes > Import CSS File** to load any local `.css` file. You can also find community themes at [themes-for-ytmdesktop-player](https://github.com/kerichdev/themes-for-ytmdesktop-player).

---

## Credits

- Original author and maintainer: [th-ch](https://github.com/th-ch)
- Contributors: See [GitHub contributors](https://github.com/th-ch/youtube-music/graphs/contributors)
- Translations powered by [Weblate](https://hosted.weblate.org/projects/youtube-music/)
- Built with [Electron](https://www.electronjs.org/), [Vite](https://vitejs.dev/), and [SolidJS](https://www.solidjs.com/)
