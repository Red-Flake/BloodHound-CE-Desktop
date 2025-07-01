const { app, session, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const ses = session.fromPartition('persist:name');
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      session: ses
    },
  });

  win.loadURL('http://localhost:9090');
}

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
