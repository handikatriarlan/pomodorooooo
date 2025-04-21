import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import electronSquirrelStartup from 'electron-squirrel-startup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disableHardwareAcceleration();

if (electronSquirrelStartup) {
    app.quit();
}

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 650,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, '../public/vite.svg'),
        title: 'Pomodoro Timer',
        backgroundColor: '#ffffff',
        show: false,
        resizable: true,
        alwaysOnTop: true,
    });

    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        mainWindow.loadURL('http://localhost:3000');
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('get-system-theme', () => {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
});

nativeTheme.on('updated', () => {
    if (mainWindow) {
        mainWindow.webContents.send('system-theme-updated',
            nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    }
});