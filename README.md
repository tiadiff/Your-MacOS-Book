# LibroMagico - Standalone Offline App

LibroMagico is a beautiful, offline-first digital book editor and reader. It allows you to create and read magical books with a premium design, all without needing an internet connection or a local server.

## 🚀 Getting Started

This application is bundled as a standalone macOS app. You don't need to install Node.js or run any terminal commands to use it.

### 📥 Installation (macOS)

1.  **Download**: Get the latest `.dmg` file from the [Releases](https://github.com/tiadiff/Your-MacOS-Book/releases) or the root of this repository.
2.  **Open**: Double-click the `LibroMagico-0.0.0.dmg` file.
3.  **Install**: Drag the **LibroMagico** icon into your **Applications** folder.
4.  **Launch**: Open your Applications folder and double-click **LibroMagico**.

> **Note**: Since this is a self-signed app, you might need to right-click and select "Open" the first time, or allow it in *System Settings > Privacy & Security*.

## ✨ Features

- **Full Offline Support**: Your books are saved locally on your computer. No server required.
- **Premium Design**: Built with Tailwind CSS v4 for a rich, "paper-like" experience.
- **Markdown Editor**: Write your magic using simple Markdown syntax.
- **Responsive Reader**: A beautiful reading mode that feels like a real book.

## 🛠 For Developers

If you want to modify the source code:

1.  **Clone the repo**: `git clone https://github.com/tiadiff/Your-MacOS-Book.git`
2.  **Install dependencies**: `npm install`
3.  **Run Dev Mode**: `npm run dev` (Access at `http://localhost:5173`)
4.  **Build App**: `npm run electron:build`

---
Built with ❤️ using React, Vite, and Electron.
