const { app, session, BrowserWindow } = require('electron');
const path = require('path');

// Get bhce_host and bhce_port from package.json config
const config = app.getAppPath();
const packageJson = require(path.join(config, 'package.json'));
const bhce_host = packageJson.config.bhce_server.host;
const bhce_port = packageJson.config.bhce_server.port;
const bhce_url = `http://${bhce_host}:${bhce_port}`;

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

  win.loadURL(bhce_url);
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
