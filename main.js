const { app, BrowserWindow, ipcMain, Tray, Menu, Notification, shell, dialog, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

// ── Persistent settings (remembers last DB path, window size, etc.) ──
const store = new Store({
  defaults: {
    lastDbPath: null,
    windowBounds: { width: 1400, height: 900 },
    openOnStartup: false,
    minimizeToTray: true,
  }
});

let mainWindow = null;
let tray = null;
let isQuitting = false;

// ── App single-instance lock ──
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// ── Create main window ──
function createWindow() {
  const bounds = store.get('windowBounds');

  mainWindow = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    minWidth: 900,
    minHeight: 600,
    title: 'NetVisor',
    icon: getAppIcon(),
    backgroundColor: '#0B1120',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false, // show after ready-to-show
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Show window once fully loaded (avoids white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Save window size on resize
  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      store.set('windowBounds', mainWindow.getBounds());
    }
  });

  // Minimize to tray instead of closing (if setting is on)
  mainWindow.on('close', (e) => {
    if (!isQuitting && store.get('minimizeToTray')) {
      e.preventDefault();
      mainWindow.hide();
      showTrayNotification('NetVisor', 'NetVisor is still running in the system tray.');
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links in the default browser, not inside the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ── System tray ──
function createTray() {
  const icon = getAppIcon();
  tray = new Tray(icon);
  tray.setToolTip('NetVisor — Infrastructure Manager');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open NetVisor',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Open on Startup',
      type: 'checkbox',
      checked: store.get('openOnStartup'),
      click: (item) => {
        store.set('openOnStartup', item.checked);
        setLoginItemSettings(item.checked);
      }
    },
    {
      label: 'Minimize to Tray on Close',
      type: 'checkbox',
      checked: store.get('minimizeToTray'),
      click: (item) => {
        store.set('minimizeToTray', item.checked);
      }
    },
    { type: 'separator' },
    {
      label: 'Quit NetVisor',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

function getAppIcon() {
  // Use platform-appropriate icon
  if (process.platform === 'win32') {
    const ico = path.join(__dirname, 'assets', 'icon.ico');
    if (fs.existsSync(ico)) return ico;
  }
  if (process.platform === 'darwin') {
    const icns = path.join(__dirname, 'assets', 'icon.icns');
    if (fs.existsSync(icns)) return icns;
  }
  const png = path.join(__dirname, 'assets', 'icon.png');
  if (fs.existsSync(png)) return png;
  // Fallback: empty image so app doesn't crash without icons
  return nativeImage.createEmpty();
}

function showTrayNotification(title, body) {
  if (Notification.isSupported()) {
    new Notification({ title, body, icon: getAppIcon() }).show();
  }
}

function setLoginItemSettings(enabled) {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    openAsHidden: true,
    path: app.getPath('exe'),
  });
}

// ── IPC handlers (called from renderer via preload bridge) ──

// Read file
ipcMain.handle('fs:readFile', async (_event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// Write file
ipcMain.handle('fs:writeFile', async (_event, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// Open file picker dialog
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open NetVisor Database',
    filters: [{ name: 'NetVisor Database', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (result.canceled || !result.filePaths.length) return { canceled: true };
  return { canceled: false, filePath: result.filePaths[0] };
});

// Save file picker dialog
ipcMain.handle('dialog:saveFile', async (_event, suggestedName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Create NetVisor Database',
    defaultPath: suggestedName || 'netvisor-database.json',
    filters: [{ name: 'NetVisor Database', extensions: ['json'] }],
  });
  if (result.canceled) return { canceled: true };
  return { canceled: false, filePath: result.filePath };
});

// Export JSON dialog (plain backup)
ipcMain.handle('dialog:exportJson', async (_event, suggestedName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export NetVisor Backup',
    defaultPath: suggestedName || 'netvisor-backup.json',
    filters: [{ name: 'JSON File', extensions: ['json'] }],
  });
  if (result.canceled) return { canceled: true };
  return { canceled: false, filePath: result.filePath };
});

// Import JSON dialog
ipcMain.handle('dialog:importJson', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import NetVisor Backup',
    filters: [{ name: 'JSON File', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (result.canceled || !result.filePaths.length) return { canceled: true };
  return { canceled: false, filePath: result.filePaths[0] };
});

// Get/set last used database path
ipcMain.handle('store:getLastDb', () => store.get('lastDbPath'));
ipcMain.handle('store:setLastDb', (_event, filePath) => {
  store.set('lastDbPath', filePath);
});
ipcMain.handle('store:clearLastDb', () => {
  store.set('lastDbPath', null);
});

// Send desktop notification from renderer
ipcMain.handle('notify', (_event, title, body) => {
  showTrayNotification(title, body);
});

// Get app version
ipcMain.handle('app:getVersion', () => app.getVersion());

// ── App lifecycle ──
app.whenReady().then(() => {
  createWindow();
  createTray();

  // Apply saved startup setting on first run
  if (store.get('openOnStartup')) {
    setLoginItemSettings(true);
  }

  app.on('activate', () => {
    // macOS: re-open window when clicking dock icon
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else if (mainWindow) mainWindow.show();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  // On macOS, keep app alive in tray even when all windows closed
  if (process.platform !== 'darwin') {
    if (!store.get('minimizeToTray')) app.quit();
  }
});

// Security: prevent new window creation
app.on('web-contents-created', (_event, contents) => {
  contents.on('will-navigate', (e, url) => {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'file:') {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
});
