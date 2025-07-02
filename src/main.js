const { app, session, BrowserWindow, Menu, screen } = require('electron');
const platform = require('os').platform();
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

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Construct the URL using the host and port
const bhce_url = `http://${bhce_host}:${bhce_port}`;

// Construct the window
function createWindow() {
  // Create browser session
  const ses = session.fromPartition('persist:name');

  // Get the primary display's work area size
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window with full screen dimensions
  if (platform === 'darwin') {
      mainWindow = new BrowserWindow({
          width: width,   // Set to screen width
          height: height, // Set to screen height
          icon: path.join(__dirname, 'assets', 'icon.png'),
          webPreferences: {
              nodeIntegration: true,
              contextIsolation: true,
              enableRemoteModule: true,
              session: ses,
          },
          resizable: true, // Allow resizing
          backgroundColor: '#1B262C', // Dark background for smoother loading
      });
  } else if (platform === 'linux') {
      mainWindow = new BrowserWindow({
        width: width,   // Set to screen width
        height: height, // Set to screen height
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          enableRemoteModule: true,
          session: ses,
        },
        resizable: true, // Allow resizing
        backgroundColor: '#1B262C', // Dark background for smoother loading
      });
  } else {
      mainWindow = new BrowserWindow({
        width: width,   // Set to screen width
        height: height, // Set to screen height
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          enableRemoteModule: true,
          session: ses,
        },
        resizable: true, // Allow resizing
        backgroundColor: '#1B262C', // Dark background for smoother loading
      });
    }

    // Load the constructed URL
    mainWindow.loadURL(bhce_url).catch((err) => {
      console.error('Failed to load URL:', err);
      mainWindow.loadURL('data:text/html,<h1 style="color: white; text-align: center;">Error: Could not connect to the server. Please check your network or server status.</h1>');
    });

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });

    const template = [
      {
        label: 'Application',
        submenu: [
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function () {
              app.quit();
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            selector: 'undo:',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            selector: 'redo:',
          },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            selector: 'copy:',
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            selector: 'paste:',
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:',
          },
          {
            label: 'Open Developer Tools',
            accelerator: 'CmdOrCtrl+Shift+I',
            click(item, focusedWindow) {
              mainWindow.webContents.openDevTools();
            },
          },
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click(item, focusedWindow) {
              if (focusedWindow) focusedWindow.reload();
            },
          },
        ],
      },
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    mainWindow.setMenuBarVisibility(false);
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