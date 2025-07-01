{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    electron_36-bin             # Electron 36.6.0 binary distribution
    nodePackages_latest.nodejs  # Latest Node.js version
    nodePackages_latest.npm     # npm for managing JavaScript dependencies

    # Libraries required by Electron
    glib              # Provides libglib-2.0.so.0
    gtk3              # GTK3 for GUI components
    nss               # Network Security Services
    nspr              # Netscape Portable Runtime
    atk               # Accessibility toolkit
    cups              # Printing support
    dbus              # Inter-process communication
    expat             # XML parsing
    fontconfig        # Font configuration
    freetype          # Font rendering
    gdk-pixbuf        # Image loading
    libnotify         # Desktop notifications
    libsecret         # Secret storage
    pango             # Text rendering
    xorg.libX11       # X11 base library
    xorg.libXcomposite # X11 composite extension
    xorg.libXdamage   # X11 damage extension
    xorg.libXext      # X11 extensions
    xorg.libXfixes    # X11 fixes extension
    xorg.libXrandr    # X11 resize and rotate
    xorg.libxcb       # X11 client-side library
    xorg.libxkbfile   # X11 keyboard file handling
    libappindicator-gtk3 # Optional: for system tray support

    wayland # for wayland support
    wayland-protocols # for wayland support
  ];

  shellHook = ''
    export PATH=${pkgs.electron_36-bin}/bin:$PATH
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Electron version: $(electron --version)"
    echo "Development environment for Bloodhound CE Electron wrapper is ready!"
    echo "You can run 'npm install' and 'npm start' in the BloodHound-CE-Desktop directory."
  '';
}