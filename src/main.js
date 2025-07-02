const { app, session, BrowserWindow } = require('electron');
const path = require('path');
const argv = process.argv.slice(2); // Get command-line arguments

// Function to get host and port from package.json or command-line flags
function getServerConfig() {
  const config = app.getAppPath();
  const packageJson = require(path.join(config, 'package.json'));
  const defaultHost = packageJson.config.bhce_server.host;
  const defaultPort = packageJson.config.bhce_server.port;

  const hostIndex = argv.indexOf('--host');
  const portIndex = argv.indexOf('--port');

  const host = hostIndex !== -1 && hostIndex + 1 < argv.length ? argv[hostIndex + 1] : defaultHost;
  const port = portIndex !== -1 && portIndex + 1 < argv.length ? argv[portIndex + 1] : defaultPort;

  return { host, port };
}

function createWindow() {
  const ses = session.fromPartition('persist:name');
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      session: ses,
    },
    resizable: true, // Allow resizing
    backgroundColor: '#1B262C', // Dark background for smoother loading
  });

  const { host, port } = getServerConfig();
  const bhce_url = `http://${host}:${port}`;

  win.loadURL(bhce_url).catch((err) => {
    console.error('Failed to load URL:', err);
    win.loadURL('data:text/html,<h1 style="color: white; text-align: center;">Error: Could not connect to the server. Please check your network or server status.</h1>');
  });

  // Open DevTools for debugging (comment out in production)
  // win.webContents.openDevTools();
}

// Wait for the app to be ready before configuring the session
app.whenReady().then(() => {
  createWindow(); // Create the window after session is configured

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});