const { app, session, BrowserWindow } = require('electron');

function createWindow() {
  const ses = session.fromPartition('persist:name');
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      session: ses
    },
  });

  win.loadURL('http://localhost:9090');
}

// Command-line switches can be set before the app is ready
app.commandLine.appendSwitch('enable-gpu-rasterization'); // Enhances GPU rendering
app.commandLine.appendSwitch('enable-accelerated-2d-canvas'); // Enhances GPU rendering
app.commandLine.appendSwitch('ignore-gpu-blacklist');     // Forces GPU use

// Wait for the app to be ready before configuring the session
app.whenReady().then(() => {
  createWindow(); // Create the window after session is configured

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
