const { contextBridge, ipcRenderer } = require('electron');

// Expõe APIs seguras para o processo renderer (React)
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemplo: função para enviar mensagem ao processo principal
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  // Exemplo: função para receber mensagem do processo principal
  onMessage: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
