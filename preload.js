const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    saveSettings: (config) => ipcRenderer.send('save-settings', config),
    onShowReminder: (callback) => ipcRenderer.on('show-reminder', (event, text) => callback(text)),
    openSettings: () => ipcRenderer.send('open-settings'),
    markFirstLaunchDone: () => ipcRenderer.send('mark-first-launch-done')
});
