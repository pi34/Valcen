const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('context', {
  isElectron: true,
  openFullWindow: () => ipcRenderer.send('open-full-window'),
  closeSidebar: () => ipcRenderer.send('close-sidebar'),
  quit: () => ipcRenderer.send('quit-app'),
  broadcast: (payload) => ipcRenderer.send('state-event', payload),
  onBroadcast: (handler) => {
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on('state-event', listener);
    return () => ipcRenderer.removeListener('state-event', listener);
  },
});
