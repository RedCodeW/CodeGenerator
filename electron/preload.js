// preload.js
const { contextBridge, ipcRenderer } =require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    generate: (files) => ipcRenderer.invoke('generate', files)
});