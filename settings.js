import { SettingsManager } from './settings-manager.js';

export async function initSettings(windowId) {
    const settingsManager = new SettingsManager();
    
    const content = `
        <div class="settings-app">
            <div class="settings-sidebar">
                <div class="settings-search">
                    <input type="text" placeholder="Search settings">
                </div>
                <div class="settings-nav">
                    <div class="nav-item active" data-section="general">
                        <svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>
                        General
                    </div>
                    <div class="nav-item" data-section="appearance">
                        <svg viewBox="0 0 24 24"><path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z"/></svg>
                        Appearance
                    </div>
                    <div class="nav-item" data-section="desktop">
                        <svg viewBox="0 0 24 24"><path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"/></svg>
                        Desktop & Dock
                    </div>
                    <div class="nav-item" data-section="security">
                        <svg viewBox="0 0 24 24"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/></svg>
                        Security
                    </div>
                    <div class="nav-item" data-section="sound">
                        <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z"/></svg>
                        Sound
                    </div>
                </div>
            </div>
            <div class="settings-content">
                <div class="settings-section active" id="general-section">
                    <h2>General</h2>
                    <div class="settings-group">
                        <div class="settings-option">
                            <label>Language</label>
                            <select data-setting="general.language">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                        <div class="settings-option">
                            <label>Time Zone</label>
                            <select data-setting="general.timezone">
                                <option value="UTC">UTC</option>
                                <option value="EST">Eastern Time</option>
                                <option value="PST">Pacific Time</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section" id="appearance-section">
                    <h2>Appearance</h2>
                    <div class="settings-group">
                        <div class="settings-option">
                            <label>Theme</label>
                            <select data-setting="appearance.theme">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                        <div class="settings-option">
                            <label>Accent Color</label>
                            <input type="color" data-setting="appearance.accentColor">
                        </div>
                        <div class="settings-option">
                            <label>Transparency</label>
                            <div class="toggle-switch">
                                <input type="checkbox" data-setting="appearance.transparency">
                                <span class="slider"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-section" id="desktop-section">
                    <h2>Desktop & Dock</h2>
                    <div class="settings-group">
                        <div class="settings-option">
                            <label>Dock Position</label>
                            <select data-setting="dock.position">
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div class="settings-option">
                            <label>Dock Size</label>
                            <input type="range" min="32" max="96" data-setting="dock.size">
                        </div>
                        <div class="settings-option">
                            <label>Auto-hide Dock</label>
                            <div class="toggle-switch">
                                <input type="checkbox" data-setting="dock.autoHide">
                                <span class="slider"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initSettingsFunctionality(windowId, settingsManager);
    }, 0);

    return content;
}

function initSettingsFunctionality(windowId, settingsManager) {
    const settingsApp = document.querySelector(`#${windowId} .settings-app`);
    const navItems = settingsApp.querySelectorAll('.nav-item');
    const sections = settingsApp.querySelectorAll('.settings-section');
    const searchInput = settingsApp.querySelector('.settings-search input');

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            item.classList.add('active');
            const sectionId = `${item.dataset.section}-section`;
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const options = settingsApp.querySelectorAll('.settings-option');
        
        options.forEach(option => {
            const label = option.querySelector('label').textContent.toLowerCase();
            option.style.display = label.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    // Settings changes
    settingsApp.addEventListener('change', (e) => {
        const setting = e.target.dataset.setting;
        if (setting) {
            const [category, name] = setting.split('.');
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            settingsManager.updateSetting(category, name, value);
        }
    });

    // Load saved settings
    settingsManager.loadSettings();
}