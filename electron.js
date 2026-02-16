import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true, // Crucial for security
        },
        icon: path.join(__dirname, 'dist', 'icon.icns'), // We will handle icon placement during build
    });

    // Load the dist/index.html file
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    win.loadFile(indexPath).catch(err => {
        console.error('Failed to load file:', err);
    });

    // Open DevTools in development (optional)
    // if (process.env.NODE_ENV === 'development') {
    //   win.webContents.openDevTools();
    // }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
