// New file to handle window creation, moved from script.js
import { WebApps } from './web-apps.js';

export async function createAppWindow(appName, action) {
    const windowId = `${appName}-${Date.now()}`;
    const windowElem = document.createElement('div');
    windowElem.className = 'window';
    windowElem.id = windowId;
    windowElem.dataset.app = appName;
    
    document.body.appendChild(windowElem);
    
    let content;
    // Check if this should be a web app
    const webAppContent = WebApps.initializeWebApp(appName);
    
    if (webAppContent) {
        content = webAppContent;
    } else {
        // Fallback to existing app initialization
        switch (action) {
            case 'openBrowser':
                content = await initSafari(windowId);
                break;
            case 'openSettings':
                content = await initSettings(windowId);
                break;
            default:
                content = `<div class="app-content">${appName} Content</div>`;
        }
    }
    
    windowElem.innerHTML = `
        <div class="window-header">
            <div class="window-buttons">
                <div class="window-button close"></div>
                <div class="window-button minimize"></div>
                <div class="window-button maximize"></div>
            </div>
            <div class="window-title">${appName}</div>
        </div>
        <div class="window-content">
            ${content}
        </div>
    `;
    
    initWindowManager(windowElem);
    setupWindowControls(windowId, appName);
    
    const windows = document.querySelectorAll('.window');
    const highestZ = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 1000)));
    windowElem.style.zIndex = highestZ + 1;

    return windowElem;
}