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

## Demo Image

| Player Screen (album color theme & ambient light) |
|:--------------------------------------------------:|
|![Screenshot1](https://github.com/user-attachments/assets/53efdf73-b8fa-4d7b-a235-b96b91ea77fc)|

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Available Plugins](#available-plugins)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [Building from Source](#building-from-source)
- [Testing](#testing)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

---

## Project Overview

YouTube Music Desktop App is an **Electron wrapper** around YouTube Music that provides a native desktop experience with powerful plugin support. It enhances the web version with features like an ad blocker, Discord Rich Presence, audio equalizer, crossfade, custom themes, and much more — all configurable through an in-app plugin system.

### Tech Stack

| Component           | Technology                          |
|---------------------|--------------------------------------|
| **Framework**       | Electron 35 + Electron-Vite 3.1      |
| **UI (Renderer)**   | SolidJS 1.9, Solid Styled Components |
| **Language**        | TypeScript 5.8                       |
| **Build Tool**      | Vite 6.2 + esbuild 0.25              |
| **State / Config**  | electron-store (conf 13)             |
| **Internationalization** | i18next 24 (40+ languages)     |
| **Testing**         | Playwright 1.51                      |
| **Linting**         | ESLint 9 + Prettier                  |
| **Package Manager** | pnpm 10+                              |
| **Packaging**       | electron-builder 26                  |

---

## Features

- **Auto confirm when paused** (Always Enabled): disable the ["Continue Watching?"](https://user-images.githubusercontent.com/61631665/129977894-01c60740-7ec6-4bf0-9a2c-25da24491b0e.png) popup that pauses music after a certain time
- **Plugin system**: Extend functionality with 30+ built-in plugins, toggled on/off from the settings menu
- **Custom themes**: Load CSS files to change the look and feel
- **Multi-platform**: Windows, macOS, Linux (AppImage, deb, rpm, flatpak, snap, freebsd)
- **Internationalization**: Translated into 40+ languages via [Hosted Weblate](https://hosted.weblate.org/projects/youtube-music/)
- **Auto-update**: Built-in update support via electron-updater

And more through the plugin ecosystem...

---

## Available Plugins

| Plugin | Description |
|--------|-------------|
| **Ad Blocker** | Block all ads and tracking out of the box |
| **Album Actions** | Adds Undislike, Dislike, Like, and Unlike buttons to apply to all songs in a playlist or album |
| **Album Color Theme** | Applies a dynamic theme and visual effects based on the album color palette |
| **Ambient Mode** | Applies a lighting effect by casting gentle colors from the video into your screen's background |
| **Audio Compressor** | Apply compression to audio (lowers the volume of the loudest parts and raises the volume of the softest parts) |
| **Blur Navigation Bar** | Makes the navigation bar transparent and blurry |
| **Bypass Age Restrictions** | Bypass YouTube's age verification |
| **Captions Selector** | Enable captions |
| **Compact Sidebar** | Always set the sidebar in compact mode |
| **Crossfade** | Crossfade between songs |
| **Disable Autoplay** | Makes every song start in "paused" mode |
| **Discord Rich Presence** | Show your friends what you listen to with [Rich Presence](https://discord.com/) |
| **Downloader** | Download MP3 directly from the interface using [youtube-dl](https://github.com/ytdl-org/youtube-dl) |
| **Equalizer** | Add filters to boost or cut specific frequency ranges (e.g. bass booster) |
| **Exponential Volume** | Makes the volume slider exponential so it's easier to select lower volumes |
| **In-App Menu** | Gives bars a fancy, dark look |
| **Scrobbler** | Scrobbling support for [Last.fm](https://www.last.fm/) and [ListenBrainz](https://listenbrainz.org/) |
| **Lumia Stream** | Adds [Lumia Stream](https://lumiastream.com/) support |
| **Lyrics Genius** | Adds lyrics support for most songs |
| **Music Together** | Share a playlist with others — when the host plays a song, everyone else hears the same song |
| **Navigation** | Next/Back navigation arrows directly integrated in the interface |
| **No Google Login** | Remove Google login buttons and links from the interface |
| **Notifications** | Display a notification when a song starts playing (interactive notifications on Windows) |
| **Picture-in-Picture** | Switch the app to picture-in-picture mode |
| **Playback Speed** | Adds a slider that controls song speed |
| **Precise Volume** | Control the volume precisely using mousewheel/hotkeys with a custom HUD |
| **Shortcuts (& MPRIS)** | Global hotkeys for playback, override media keys, Ctrl/CMD+F search, Linux MPRIS support |
| **Skip Disliked Song** | Automatically skip disliked songs |
| **Skip Silences** | Automatically skip silenced sections |
| **SponsorBlock** | Automatically skip non-music parts like intro/outro using [SponsorBlock](https://github.com/ajayyy/SponsorBlock) |
| **Synced Lyrics** | Synced lyrics using providers like [LRCLib](https://lrclib.net) |
| **Taskbar Media Control** | Control playback from your Windows taskbar |
| **TouchBar** | Custom TouchBar layout for macOS |
| **Tuna OBS** | Integration with [OBS](https://obsproject.com/)'s [Tuna](https://obsproject.com/forum/resources/tuna.843/) plugin |
| **Video Quality Changer** | Change video quality from the video overlay |
| **Video Toggle** | Switch between Video/Song mode, optionally remove the video tab |
| **Visualizer** | Different music visualizers |

---

## Installation

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 ([install guide](https://pnpm.io/installation))

### Download Prebuilt Binaries

You can check the [latest release](https://github.com/th-ch/youtube-music/releases/latest) for prebuilt installers and portable binaries.

#### Arch Linux

Install the [`youtube-music-bin`](https://aur.archlinux.org/packages/youtube-music-bin) package from the AUR. For AUR installation instructions, see this [wiki page](https://wiki.archlinux.org/index.php/Arch_User_Repository#Installing_packages).

#### macOS

Via Homebrew (see the [cask definition](https://github.com/th-ch/homebrew-youtube-music)):

```bash
brew install th-ch/youtube-music/youtube-music
```

If you get the error "is damaged and can't be opened", run:

```bash
/usr/bin/xattr -cr /Applications/YouTube\ Music.app
```

#### Windows

Via [Scoop](https://scoop.sh):

```bash
scoop bucket add extras
scoop install extras/youtube-music
```

Via [Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/):

```bash
winget install th-ch.YouTubeMusic
```

> **Note:** Microsoft Defender SmartScreen might block the installation since it is from an "unknown publisher." The same applies to manual `.exe` downloads.

##### Offline Installation (Windows)

1. Download the `*.nsis.7z` file for your device architecture from the [release page](https://github.com/th-ch/youtube-music/releases/latest):
   - `x64` for 64-bit Windows
   - `ia32` for 32-bit Windows
   - `arm64` for ARM64 Windows
2. Download the installer (`*-Setup.exe`)
3. Place them in the **same directory**
4. Run the installer

### Install from Source

```bash
git clone https://github.com/th-ch/youtube-music
cd youtube-music
pnpm install --frozen-lockfile
```

---

## Usage

### Running in Development Mode

```bash
pnpm dev
```

This starts the Electron app with hot-reload enabled (watches for file changes).

### Running a Production Preview

```bash
pnpm start
```

### Building for Distribution

```bash
pnpm dist:win      # Windows
pnpm dist:linux    # Linux (amd64)
pnpm dist:mac      # macOS (amd64)
pnpm dist:mac:arm64      # macOS (arm64)
pnpm dist:linux:deb-arm64 # Linux (arm64 Debian)
pnpm dist:linux:rpm-arm64 # Linux (arm64 Fedora)
```

The output binaries will be placed in the `pack/` directory.

### Command-Line Arguments

The app supports standard Electron command-line flags. You can also pass `--no-sandbox`, `--disable-gpu`, and other Chromium flags for debugging or CI environments. For example, in test mode:

```bash
electron . --no-sandbox --disable-gpu --whitelisted-ips= --disable-dev-shm-usage
```

### Enabling Plugins

Plugins are managed through the in-app settings menu. Navigate to **Options > Plugins** to enable, disable, and configure each plugin individually. Some plugins require a restart after toggling.

### Applying Themes

1. Go to **Options > Visual Tweaks > Themes**
2. Load a CSS file to change the look of the application
3. Predefined themes are available at [themes-for-ytmdesktop-player](https://github.com/kerichdev/themes-for-ytmdesktop-player)

---

## Configuration

### Environment Variables

| Variable              | Description                                       |
|-----------------------|---------------------------------------------------|
| `NODE_ENV`            | Set to `test` for test mode                       |
| `ELECTRON_ENABLE_LOGGING` | Set to `1` to enable verbose Electron logging |
| `DEBUG`               | Playwright debug patterns (e.g., `pw:*`)          |

### Plugin Configuration

Each plugin stores its own configuration (enabled state, custom options) in the app's persistent config store (`electron-store`). These are exposed through the plugin API as `getConfig()` and `setConfig()`.

### Theme Configuration

Custom CSS themes can be loaded from local files. The app's base style can be extended with user-provided stylesheets loaded through the Visual Tweaks panel.

---

## Development

### Project Structure

```
youtube-music/
├── src/
│   ├── index.ts              # Main process entry (Electron main)
│   ├── preload.ts            # Preload script
│   ├── renderer.ts           # Renderer process entry
│   ├── index.html            # Renderer HTML entry
│   ├── config/               # App configuration store
│   │   ├── index.ts
│   │   ├── store.ts
│   │   ├── defaults.ts
│   │   └── plugins.ts
│   ├── plugins/              # Plugin implementations
│   │   ├── ad-blocker/
│   │   ├── discord/
│   │   ├── playback-speed/
│   │   ├── sponsorblock/
│   │   └── ...               # 30+ plugins
│   ├── providers/            # Service providers (MPRIS, etc.)
│   ├── i18n/                 # Internationalization resources
│   │   ├── index.ts
│   │   └── resources/        # 40+ language JSON files
│   ├── utils/                # Shared utilities
│   ├── types/                # TypeScript type definitions
│   └── loader/               # Plugin loader (main, preload, renderer)
├── tests/
│   └── index.test.js         # Playwright integration test
├── assets/                   # App icons and static assets
├── patches/                  # pnpm patched dependencies
├── vite-plugins/             # Custom Vite plugins
├── web/                      # Website / screenshot assets
├── docs/                     # Documentation and translated READMEs
├── electron.vite.config.mts  # Build configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.mjs         # ESLint configuration
├── .prettierrc               # Prettier configuration
└── package.json              # Dependencies and scripts
```

### Development Workflow

1. **Clone and install**: `pnpm install --frozen-lockfile`
2. **Start dev server**: `pnpm dev` — runs Electron with Vite HMR
3. **Enable debug logging**: `pnpm dev:debug` — adds `ELECTRON_ENABLE_LOGGING=1`
4. **Run renderer-only** (without main process reload): `pnpm dev:renderer`
5. **Type-check**: `pnpm typecheck` — runs `tsc --noEmit`
6. **Lint**: `pnpm lint` — runs ESLint across the codebase
7. **Test**: `pnpm test` — runs Playwright integration tests

### Code Style

- **Indentation**: 2 spaces (configured in `.editorconfig` and `.prettierrc`)
- **Quotes**: Single quotes (Prettier)
- **Semicolons**: Enabled (ESLint default)
- **Linting**: ESLint 9 with `@stylistic`, `typescript-eslint`, and Prettier integration
- Run `pnpm lint` before committing to catch style issues

### Internationalization

Translations are managed via [Hosted Weblate](https://hosted.weblate.org/projects/youtube-music/). To add or update translations:

1. Edit the appropriate JSON file in `src/i18n/resources/`
2. Update the type definitions in `src/i18n/resources/@types/index.ts` if adding new keys
3. Submit a pull request, or contribute directly through Weblate

<a href="https://hosted.weblate.org/engage/youtube-music/">
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/multi-auto.svg" alt="translation status" />
  <img src="https://hosted.weblate.org/widget/youtube-music/i18n/287x66-black.png" alt="translation status 2" />
</a>

### Building Your Own Plugins

Plugins can manipulate the `BrowserWindow` from Electron and change the frontend by manipulating the HTML/CSS.

#### Creating a Plugin

Create a folder in `src/plugins/YOUR-PLUGIN-NAME` with an `index.ts`:

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
    onPlayerApiReady(api: YoutubePlayer, context: RendererContext) {
      context.setConfig({ myConfig: api.getVolume() });
    },
    onConfigChange(newConfig) { /* ... */ },
    stop(_context) { /* ... */ },
  },
  preload: {
    async start({ getConfig }) { const config = await getConfig(); },
    onConfigChange(newConfig) {},
    stop(_context) {},
  },
});
```

#### Common Use Cases

**Injecting custom CSS:**

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

**Changing HTML:**

```typescript
import { createPlugin } from '@/utils';

export default createPlugin({
  name: 'Plugin Label',
  restartNeeded: true,
  config: { enabled: false },
  renderer() {
    document.querySelector(".sign-in-link.ytmusic-nav-bar").remove();
  },
});
```

**Front-to-back communication:** Use `ipcMain` / `ipcRenderer` from Electron. See the `sponsorblock` plugin for a complete example.

---

## Testing

```bash
pnpm test
```

Tests use [Playwright](https://playwright.dev/) for end-to-end integration testing. The test suite:

1. Launches the Electron app
2. Waits for the first browser window
3. Handles the YouTube consent form if present
4. Verifies the app navigates to `https://music.youtube.com`

For debug mode:

```bash
pnpm test:debug   # Enables Playwright debug logging (DEBUG=pw:*)
```

### Adding Tests

Tests are located in the `tests/` directory. The existing test (`tests/index.test.js`) demonstrates the standard pattern for launching and interacting with the app. You can add additional test files following the same structure.

---

## Contributing

We welcome contributions! Here's how to get started:

### How to Contribute

1. **Fork** the repository
2. **Create a feature branch** from `master`:
   ```bash
   git checkout -b feat/my-feature
   ```
3. **Make your changes**, following the code style (2-space indent, single quotes, TypeScript)
4. **Run linting**: `pnpm lint`
5. **Run type-checking**: `pnpm typecheck`
6. **Run tests**: `pnpm test`
7. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add my new feature"
   ```
8. **Push** and open a Pull Request

### Pull Request Guidelines

- Keep PRs focused on a single concern — avoid unrelated changes
- Write descriptive titles and include context in the description
- If adding a new plugin, include its folder under `src/plugins/` with the standard structure
- If changing UI strings, update the corresponding i18n resource files
- Reference any related issues in the PR description

### Reporting Issues

- **Bug reports**: Use the [Bug Report template](https://github.com/th-ch/youtube-music/issues/new?template=bug_report.yml)
- **Feature requests**: Use the [Feature Request template](https://github.com/th-ch/youtube-music/issues/new?template=feature_request.yml)
- Before filing, search [existing issues](https://github.com/th-ch/youtube-music/issues) to avoid duplicates

### Code Review Process

- All PRs require at least one review from a maintainer before merging
- Address review feedback promptly — keep the conversation constructive
- CI checks (lint, typecheck, build) must pass before merging

---

## FAQ

### Why isn't the app's menu showing up?

If the **Hide Menu** option is on, you can show the menu with the <kbd>alt</kbd> key (or <kbd>\`</kbd> [backtick] if using the In-App Menu plugin). See [this post](https://github.com/th-ch/youtube-music/issues/410#issuecomment-952060709) if you have trouble accessing the menu after enabling In-App Menu + hide-menu.

---

## License

MIT © [th-ch](https://github.com/th-ch/youtube-music)