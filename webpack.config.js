const path = require('path');

module.exports = {
  mode: 'production', // Optimizes the bundle for production
  entry: './src/main.js', // Your Electron main process entry file (adjust if different)
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundle
    filename: 'bundle.js', // Name of the bundled file
  },
  target: 'electron-main', // Ensures compatibility with Electron’s main process
};

