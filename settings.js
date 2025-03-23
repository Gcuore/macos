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
                    ${generateSettingsNav()}
                </div>
            </div>
            <div class="settings-content">
                ${generateSettingsContent(settingsManager.settings)}
            </div>
        </div>
    `;

    setTimeout(() => {
        initSettingsFunctionality(windowId, settingsManager);
    }, 0);

    return content;
}

function generateSettingsNav() {
    const sections = [
        {id: 'general', icon: 'cog', name: 'General'},
        {id: 'appearance', icon: 'palette', name: 'Appearance'},
        {id: 'desktop', icon: 'desktop', name: 'Desktop & Dock'},
        {id: 'security', icon: 'shield', name: 'Security'},
        {id: 'sound', icon: 'volume-high', name: 'Sound'},
        {id: 'displays', icon: 'monitor', name: 'Displays'},
        {id: 'notifications', icon: 'bell', name: 'Notifications'}
    ];

    return sections.map(section => `
        <div class="nav-item" data-section="${section.id}">
            <svg viewBox="0 0 24 24"><path d="${getIconPath(section.icon)}"/></svg>
            ${section.name}
        </div>
    `).join('');
}

function generateSettingsContent(settings) {
    return `
        <div class="settings-section" id="general-section">
            <h2>System Preferences</h2>
            <div class="settings-option">
                <label>Theme</label>
                <select data-setting="appearance.theme">
                    <option value="light" ${settings.appearance.theme === 'light' ? 'selected' : ''}>Light</option>
                    <option value="dark" ${settings.appearance.theme === 'dark' ? 'selected' : ''}>Dark</option>
                </select>
            </div>
            <div class="settings-option">
                <label>Accent Color</label>
                <input type="color" data-setting="appearance.accentColor" value="${settings.appearance.accentColor}">
            </div>
            <div class="settings-option">
                <label>Transparency</label>
                <input type="checkbox" data-setting="appearance.transparency" ${settings.appearance.transparency ? 'checked' : ''}>
            </div>
            <!-- Add more settings options -->
        </div>
    `;
}

function initSettingsFunctionality(windowId, settingsManager) {
    const settingsApp = document.querySelector(`#${windowId} .settings-app`);
    
    // Handle settings changes
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

// Helper function for icons
function getIconPath(icon) {
    // Add SVG paths for different icons
    const paths = {
        cog: 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z',
        // Add other icon paths...
    };
    return paths[icon] || '';
}