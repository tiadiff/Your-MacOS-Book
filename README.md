# LibroMagico - Native macOS Digital Interactive Book

LibroMagico is a beautiful, immersive digital book application that bridges the gap between digital content and the classic reading experience. Now available as a **native macOS application**, it wraps the core web experience into a high-performance **Chromium-based (Electron)** window for a seamless, offline, and distraction-free experience.

## ✨ Native macOS App Features

LibroMagico has been optimized for macOS to provide a premium reading and writing environment:

- **Chromium Wrapped:** Built using Electron to provide a robust and consistent experience powered by modern web technologies.
- **Offline Ready:** Once downloaded, the app functions entirely offline. No internet connection is required to create or read your books.
- **Full-Screen Immersion:** Designed to run in full-screen mode to eliminate distractions and let you focus on your stories.
- **Premium Design:** Features a curated emoji icon, transparent backgrounds, and elegant typography tailored for the macOS desktop.

## 🚀 Easy Installation

Getting started with LibroMagico on your Mac is simple:

1.  **Download:** Go to the [Releases](https://github.com/tiadiff/Your-MacOS-Book/releases) section of this repository.
2.  **Mount:** Download and open the `.dmg` file.
3.  **Install:** Drag the **LibroMagico** icon to your `Applications` folder.
4.  **Launch:** Open the app from your Launchpad or Applications folder and start writing!

---

## 📖 Core Features

*   **Realistic UI:** Immersive book styling with leather covers, paper textures, and page-flip shadows.
*   **Reading/Editing Modes:** Toggle between a clean reading interface and a powerful Markdown-based editor.
*   **Local Persistence:** Your work is automatically saved to your local machine.
*   **Import/Export:** Save your books as `.json` files to create backups or share them with others.
*   **Markdown Support:** Use standard Markdown syntax for rich text formatting.

## 🛠 Tech Stack

*   **Runtime:** Electron (Chromium)
*   **Core:** React 19 & TypeScript
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Parsing:** Marked (Markdown)

## 💻 Development & Source

If you wish to build or modify the source code locally:

1.  **Install Dependencies:** `npm install`
2.  **Develop:** `npm run dev` (browser view) or `npm run electron:dev` (app view)
3.  **Build macOS App:** `npm run electron:build`

## 📃 License

This project is open-source and available under the **MIT License**.
