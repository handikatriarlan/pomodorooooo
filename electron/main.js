import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        minWidth: 360,
        minHeight: 540,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, '../public/icon.png'),
        title: 'Pomodoro Timer',
        backgroundColor: '#ffffff',
        show: false
    });

    // In production, use the static files
    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        // In development, connect to the Vite dev server
        mainWindow.loadURL('http://localhost:3000');
        // Open the DevTools
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle theme changes
ipcMain.handle('get-system-theme', () => {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
});

// Listen for theme updates
nativeTheme.on('updated', () => {
    if (mainWindow) {
        mainWindow.webContents.send('system-theme-updated',
            nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    }
});