// New file to handle settings functionality

export class SettingsManager {
  constructor() {
    this.settings = {
      appearance: {
        theme: 'light',
        accentColor: '#0066cc',
        transparency: true,
        reduceMotion: false
      },
      desktop: {
        background: '/SequoiaDark.png',
        resolution: 'native',
        nightShift: false
      },
      dock: {
        position: 'bottom',
        magnification: true,
        autoHide: false
      },
      sound: {
        volume: 75,
        balance: 0,
        outputDevice: 'Built-in Output'
      },
      security: {
        lockOnSleep: true,
        requirePassword: true,
        firewall: true
      }
    };
  }

  updateSetting(category, setting, value) {
    if (this.settings[category] && this.settings[category].hasOwnProperty(setting)) {
      this.settings[category][setting] = value;
      this.applySettings();
    }
  }

  applySettings() {
    // Apply appearance settings
    document.body.classList.toggle('dark-theme', this.settings.appearance.theme === 'dark');
    document.documentElement.style.setProperty('--accent-color', this.settings.appearance.accentColor);
    
    // Apply desktop settings
    const desktop = document.querySelector('.desktop');
    if (desktop) {
      desktop.style.backgroundImage = `url(${this.settings.desktop.background})`;
    }

    // Apply dock settings
    const dock = document.querySelector('.dock');
    if (dock) {
      dock.style.bottom = this.settings.dock.position === 'bottom' ? '0' : 'auto';
      dock.style.left = this.settings.dock.position === 'left' ? '0' : 'auto';
      dock.classList.toggle('magnification', this.settings.dock.magnification);
      dock.classList.toggle('auto-hide', this.settings.dock.autoHide);
    }

    // Store settings in localStorage
    localStorage.setItem('macosSettings', JSON.stringify(this.settings));
  }

  loadSettings() {
    const stored = localStorage.getItem('macosSettings');
    if (stored) {
      this.settings = JSON.parse(stored);
      this.applySettings();
    }
  }
}