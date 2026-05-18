/**
 * preload.js
 * Runs in a privileged context before the renderer loads.
 * Exposes a safe, minimal API to the renderer via contextBridge.
 * The renderer never has direct access to Node.js or Electron APIs.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('netvisorAPI', {

  // ── File system ──

  /** Read a file and return its text content */
  readFile: (filePath) =>
    ipcRenderer.invoke('fs:readFile', filePath),

  /** Write text content to a file */
  writeFile: (filePath, content) =>
    ipcRenderer.invoke('fs:writeFile', filePath, content),

  // ── Dialogs ──

  /** Show native open-file dialog for the encrypted database */
  openDbDialog: () =>
    ipcRenderer.invoke('dialog:openFile'),

  /** Show native save-file dialog to create a new database */
  saveDbDialog: (suggestedName) =>
    ipcRenderer.invoke('dialog:saveFile', suggestedName),

  /** Show native save dialog for plain JSON export */
  exportJsonDialog: (suggestedName) =>
    ipcRenderer.invoke('dialog:exportJson', suggestedName),

  /** Show native open dialog for plain JSON import */
  importJsonDialog: () =>
    ipcRenderer.invoke('dialog:importJson'),

  // ── Persistent settings ──

  /** Get the last opened database file path (remembered across sessions) */
  getLastDb: () =>
    ipcRenderer.invoke('store:getLastDb'),

  /** Save the current database file path for next launch */
  setLastDb: (filePath) =>
    ipcRenderer.invoke('store:setLastDb', filePath),

  /** Clear the remembered database path (e.g. on sign out) */
  clearLastDb: () =>
    ipcRenderer.invoke('store:clearLastDb'),

  // ── Desktop features ──

  /** Send a native desktop notification */
  notify: (title, body) =>
    ipcRenderer.invoke('notify', title, body),

  /** Get the current app version string */
  getVersion: () =>
    ipcRenderer.invoke('app:getVersion'),

  /** Check if running inside Electron (renderer can use this to detect environment) */
  isElectron: true,
});
