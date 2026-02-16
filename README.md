# LibroMagico - Digital Interactive Book

LibroMagico is a web application that simulates a real book experience directly in your browser. It features a beautiful, immersive UI with realistic page layouts and covers, bridging the gap between digital content and the classic reading experience.

The application operates in two distinct modes: **Reading Mode** for end-users to enjoy content, and **Editing Mode** for authors to create and modify pages using Markdown.

## Features

*   **Immersive Interface:** Realistic book styling with leather covers, paper textures, and page shadows using CSS3.
*   **Dual Modes:**
    *   **Reading Mode:** Clean, distraction-free interface for reading content.
    *   **Editing Mode:** Built-in editor to modify titles, author names, and page content using Markdown syntax.
*   **Serverless Persistence:**
    *   **Auto-Save:** Changes are automatically saved to your browser's LocalStorage.
    *   **File Export/Import:** Download your book as a JSON file to backup or share, and upload it back to resume editing on any device.
*   **Markdown Support:** Rich text formatting (Bold, Italic, Headings, Lists) supported via a simple toolbar.
*   **Responsive Design:** Adapts from a single-page view on mobile to a dual-page spread on desktop.

## Tech Stack

*   **React 19:** UI Library.
*   **TypeScript:** Type safety.
*   **Tailwind CSS:** Styling and design system.
*   **Lucide React:** Icons.
*   **Marked:** Markdown parsing.

## Installation & Setup

To run this project locally, you need [Node.js](https://nodejs.org/) installed on your machine.

1.  **Clone the repository** (or extract the project files):
    ```bash
    git clone <repository-url>
    cd libro-magico
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    To create an optimized static version of the app:
    ```bash
    npm run build
    ```

## Usage

1.  **Open the App:** Navigate to the URL provided by the development server (usually `http://localhost:5173`).
2.  **Edit Book Details:** Click on "Modifica" (Edit) in the top bar. You can now click on the Book Title or Author Name on the cover to change them.
3.  **Add/Edit Pages:**
    *   Click "Apri il Libro" (Open Book).
    *   In Edit mode, use the text area to write your content using Markdown.
    *   Use the toolbar for quick formatting.
    *   Click the "+" button to add new pages.
4.  **Save Your Work:**
    *   The app auto-saves to your browser.
    *   To backup, click the **Download** icon in the header to save a `.json` file to your computer.
    *   To restore, click the **Upload** icon and select a previously saved `.json` file.

## License

This project is open source and available under the MIT License.
