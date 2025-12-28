const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let mainWindow;
let settingsWindow;
let config = {
    url: 'https://coren.xin/',
    zoomFactor: 1.0,
    alwaysOnTop: true,
    autoStart: false,
    timers: [],
    reminders: [],
    shutdownTime: null
};

const configPath = path.join(app.getPath('userData'), 'config.json');

function loadConfig() {
    try {
        if (fs.existsSync(configPath)) {
            const loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            config = { ...config, ...loadedConfig };
        }
    } catch (e) {
        console.error('Failed to load config:', e);
    }
}

function saveConfig() {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        fullscreen: true,
        alwaysOnTop: config.alwaysOnTop,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL(config.url);

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.setZoomFactor(config.zoomFactor);
        const reminderScript = fs.readFileSync(path.join(__dirname, 'reminder.js'), 'utf8');
        mainWindow.webContents.executeJavaScript(reminderScript);
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function createSettingsWindow() {
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }

    settingsWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'AutoKiosk-Pro Settings',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    settingsWindow.loadFile('settings.html');
    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

app.on('ready', () => {
    loadConfig();
    createWindow();

    // Register global shortcuts with feedback
    const shortcutS = globalShortcut.register('CommandOrControl+S', () => {
        console.log('Settings shortcut triggered');
        createSettingsWindow();
    });
    if (!shortcutS) {
        console.error('Failed to register Ctrl+S shortcut');
    }

    const shortcutQ = globalShortcut.register('CommandOrControl+Q', () => {
        console.log('Quit shortcut triggered');
        app.quit();
    });
    if (!shortcutQ) {
        console.error('Failed to register Ctrl+Q shortcut');
    }

    // Also register accelerators using Menu for reliability
    const { Menu } = require('electron');
    const menuTemplate = [
        {
            label: 'AutoKiosk',
            submenu: [
                {
                    label: 'Settings',
                    accelerator: 'CommandOrControl+S',
                    click: () => createSettingsWindow()
                },
                {
                    label: 'Quit',
                    accelerator: 'CommandOrControl+Q',
                    click: () => app.quit()
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

    // Timed functions
    setInterval(() => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Check reminders
        config.reminders.forEach(reminder => {
            if (reminder.time === currentTime && !reminder.showed) {
                if (mainWindow) {
                    mainWindow.webContents.send('show-reminder', reminder.text);
                }
                reminder.showed = true; // Mark as showed for this minute
            } else if (reminder.time !== currentTime) {
                reminder.showed = false; // Reset for next day
            }
        });

        // Check shutdown
        if (config.shutdownTime === currentTime) {
            exec('shutdown /s /t 60'); // Give user 60 seconds to cancel
            if (mainWindow) {
                mainWindow.webContents.send('show-reminder', 'System will shutdown in 60 seconds. Save your work!');
            }
        }
    }, 10000); // Check every 10 seconds

    // Handle IPC
    ipcMain.on('save-settings', (event, newConfig) => {
        config = { ...config, ...newConfig };
        saveConfig();
        if (mainWindow) {
            mainWindow.loadURL(config.url);
            mainWindow.setAlwaysOnTop(config.alwaysOnTop);
            mainWindow.webContents.setZoomFactor(config.zoomFactor);
        }

        // Auto start settings
        app.setLoginItemSettings({
            openAtLogin: config.autoStart,
            path: app.getPath('exe')
        });
    });

    ipcMain.handle('get-config', () => config);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

// Clean up shortcuts on exit
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
