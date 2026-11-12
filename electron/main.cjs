const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  ipcMain,
  screen,
  globalShortcut,
} = require('electron');
const path = require('path');

const isDev = !app.isPackaged;
const devUrl = 'http://localhost:5173';

let tray = null;
let sidebarWindow = null;
let fullWindow = null;

function appUrl(hash) {
  if (isDev) return `${devUrl}/#${hash}`;
  const file = path.join(__dirname, '..', 'dist', 'index.html');
  return `file://${file}#${hash}`;
}

function createSidebarWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const width = 420;
  const height = Math.min(880, workArea.height - 40);

  sidebarWindow = new BrowserWindow({
    width,
    height,
    x: workArea.x + workArea.width - width - 16,
    y: workArea.y + 16,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: true,
    alwaysOnTop: false,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    skipTaskbar: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'customButtonsOnHover',
    roundedCorners: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  sidebarWindow.loadURL(appUrl('sidebar'));

  sidebarWindow.once('ready-to-show', () => {
    sidebarWindow.show();
  });

  sidebarWindow.on('closed', () => {
    sidebarWindow = null;
  });
}

function toggleSidebar() {
  if (!sidebarWindow) {
    createSidebarWindow();
    return;
  }
  if (sidebarWindow.isVisible()) {
    sidebarWindow.hide();
  } else {
    sidebarWindow.show();
    sidebarWindow.focus();
  }
}

function createFullWindow() {
  if (fullWindow && !fullWindow.isDestroyed()) {
    fullWindow.show();
    fullWindow.focus();
    return;
  }
  fullWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1000,
    minHeight: 640,
    backgroundColor: '#0A0A0C',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 18, y: 18 },
    vibrancy: 'under-window',
    visualEffectState: 'active',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  fullWindow.loadURL(appUrl('full'));
  fullWindow.once('ready-to-show', () => fullWindow.show());
  fullWindow.on('closed', () => {
    fullWindow = null;
  });
}

function broadcast(channel, payload) {
  for (const win of [sidebarWindow, fullWindow]) {
    if (win && !win.isDestroyed()) {
      win.webContents.send(channel, payload);
    }
  }
}

function registerIpc() {
  ipcMain.on('open-full-window', () => createFullWindow());
  ipcMain.on('close-sidebar', () => sidebarWindow && sidebarWindow.hide());
  ipcMain.on('quit-app', () => app.quit());

  // State sync between windows (sidebar <→ full)
  ipcMain.on('state-event', (event, payload) => {
    const sender = event.sender;
    for (const win of [sidebarWindow, fullWindow]) {
      if (win && !win.isDestroyed() && win.webContents.id !== sender.id) {
        win.webContents.send('state-event', payload);
      }
    }
  });
}

function createTray() {
  // Use empty image + title text for a clean "Valcen" word in the menu bar
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setTitle('◆ Valcen');
  tray.setToolTip('Valcen — shared memory for your team’s agents');

  tray.on('click', () => toggleSidebar());
  tray.on('right-click', () => {
    const menu = Menu.buildFromTemplate([
      {
        label: sidebarWindow && sidebarWindow.isVisible() ? 'Hide sidebar' : 'Show sidebar',
        click: toggleSidebar,
      },
      { label: 'Open Project Memory', click: createFullWindow },
      { type: 'separator' },
      { label: 'About Valcen', enabled: false },
      { label: 'Quit', click: () => app.quit() },
    ]);
    tray.popUpContextMenu(menu);
  });
}

app.whenReady().then(() => {
  if (process.platform === 'darwin' && app.dock) {
    app.dock.hide();
  }
  registerIpc();
  createTray();
  createSidebarWindow();

  // Hotkey to toggle sidebar: ⌘⇧C
  globalShortcut.register('CommandOrControl+Shift+C', () => toggleSidebar());
});

app.on('window-all-closed', (e) => {
  // Keep running in the tray on macOS
  if (process.platform === 'darwin') {
    e.preventDefault();
  } else {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
