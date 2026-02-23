const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/vite.svg'), // Opcional: ícone da janela
  });

  // Em desenvolvimento, carrega o servidor do Vite
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Abre o console do desenvolvedor automaticamente em dev
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, carrega o arquivo buildado
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Remove o menu padrão (opcional para apps internos)
  // mainWindow.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
