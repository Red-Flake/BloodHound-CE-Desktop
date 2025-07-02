const { app, session, BrowserWindow } = require('electron');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

// Default host and port values
let bhce_host = 'localhost';
let bhce_port = '9090';

// Override defaults with command-line arguments if provided
if (argv.host) {
  bhce_host = argv.host;
}
if (argv.port) {
  bhce_port = argv.port;
}

// Construct the URL using the host and port
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
      session: ses,
    },
    resizable: true, // Allow resizing
    backgroundColor: '#1B262C', // Dark background for smoother loading
  });

  // Load the constructed URL
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