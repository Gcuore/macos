// window-creator.js - Adding support for custom windows
import { initWindowManager } from './window-manager.js';
import { initSafari } from './safari.js';
import { initSettings } from './settings.js';
import { initMail } from './mail.js';
import { initMaps } from './maps.js';
import { initPhotos } from './photos.js';
import { initMusic } from './music.js';
import { initMessages } from './messages.js';
import { initAppStore } from './appstore.js';

export async function createAppWindow(appName, action) {
    try {
        const windowId = `${appName.toLowerCase()}-${Date.now()}`;
        const windowElem = document.createElement('div');
        windowElem.className = 'window';
        windowElem.id = windowId;
        windowElem.dataset.app = appName;
        
        // Initial window position with offset for cascading
        const windowCount = document.querySelectorAll('.window').length;
        const offset = windowCount * 30;
        windowElem.style.left = `${Math.max(50 + offset, 0)}px`;
        windowElem.style.top = `${Math.max(50 + offset, 0)}px`;
        windowElem.style.width = '800px';
        windowElem.style.height = '600px';
        
        // Generate window content based on the app action
        let content;
        switch(action) {
            case 'openBrowser':
                content = await initSafari(windowId);
                break;
            case 'openSettings':
                content = await initSettings(windowId);
                break;
            case 'openMail':
                content = await loadWebApp('mail', 'https://mail.google.com', true); // Set secure flag to true
                break;
            case 'openMaps':
                content = await loadWebApp('maps', 'https://maps.google.com', true); // Set secure flag to true
                break;
            case 'openPhotos':
                content = await initPhotos(windowId);
                break;
            case 'openMusic':
                content = await initMusic(windowId);
                break;
            case 'openMessages':
                content = await initMessages(windowId);
                break;
            // Web apps
            case 'openInstagram':
                content = await loadWebApp('instagram', 'https://www.instagram.com');
                break;
            case 'openSpotify':
                content = await loadWebApp('spotify', 'https://open.spotify.com');
                break;
            case 'openVSCode':
                content = await loadWebApp('vscode', 'https://vscode.dev');
                break;
            case 'openYoutube':
                content = await loadWebApp('youtube', 'https://www.youtube.com');
                break;
            case 'openAppStore':
                content = await loadWebApp('appstore', 'https://apps.apple.com/it/story/id1457219438');
                break;
            // File handlers
            case 'openQuickTime':
                content = '<div class="quicktime-app"><div class="video-container"><video controls></video></div></div>';
                break;
            case 'openPreview':
                content = '<div class="preview-app"><div class="preview-content"></div></div>';
                break;
            case 'openTextEdit':
                content = '<div class="textedit-app"><div class="textedit-toolbar"></div><div class="textedit-content"><textarea></textarea></div></div>';
                break;
            case 'openArchive':
                content = '<div class="archive-app"><div class="archive-content">Archive Utility</div></div>';
                break;
            default:
                content = '<div class="app-content">App not available</div>';
        }

        // Create window structure
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

        document.body.appendChild(windowElem);
        initWindowManager(windowElem);
        bringToFront(windowElem);
        
        // Dispatch event for Stage Manager
        const event = new CustomEvent('windowCreated', { detail: { window: windowElem } });
        document.dispatchEvent(event);
        
        return windowElem;
    } catch (error) {
        console.error('Error creating window:', error);
        return null;
    }
}

export function createCustomWindow(appName, content) {
    try {
        const windowId = `${appName.toLowerCase()}-${Date.now()}`;
        const windowElem = document.createElement('div');
        windowElem.className = 'window';
        windowElem.id = windowId;
        windowElem.dataset.app = appName;
        
        // Initial window position with offset for cascading
        const windowCount = document.querySelectorAll('.window').length;
        const offset = windowCount * 30;
        windowElem.style.left = `${Math.max(50 + offset, 0)}px`;
        windowElem.style.top = `${Math.max(50 + offset, 0)}px`;
        windowElem.style.width = '800px';
        windowElem.style.height = '600px';

        // Create window structure
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

        document.body.appendChild(windowElem);
        initWindowManager(windowElem);
        bringToFront(windowElem);
        
        // Dispatch event for Stage Manager
        const event = new CustomEvent('windowCreated', { detail: { window: windowElem } });
        document.dispatchEvent(event);
        
        return windowElem;
    } catch (error) {
        console.error('Error creating custom window:', error);
        return null;
    }
}

export function createMediaWindow(appName, mediaType, mediaSource, fileName) {
    try {
        let content;
        
        switch(mediaType) {
            case 'image':
                content = `
                    <div class="preview-app">
                        <div class="preview-content">
                            <img src="${mediaSource}" alt="${fileName}">
                        </div>
                    </div>
                `;
                break;
            case 'audio':
                content = `
                    <div class="music-app">
                        <div class="music-sidebar">
                            <div class="music-nav">
                                <div class="nav-item active">
                                    <svg viewBox="0 0 24 24"><path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8.56,12 7,13.56 7,15.5C7,17.44 8.56,19 10.5,19C12.44,19 14,17.44 14,15.5V6H18V3H12Z"/></svg>
                                    Now Playing
                                </div>
                            </div>
                        </div>
                        <div class="music-content">
                            <div class="now-playing">
                                <div class="track-info">
                                    <div class="album-art"></div>
                                    <div class="track-details">
                                        <div class="track-name">${fileName}</div>
                                        <div class="artist-name">Local File</div>
                                    </div>
                                </div>
                                <div class="playback-controls">
                                    <button class="prev-track">
                                        <svg viewBox="0 0 24 24"><path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z"/></svg>
                                    </button>
                                    <button class="play-pause" id="play-button-${Date.now()}">
                                        <svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
                                    </button>
                                    <button class="next-track">
                                        <svg viewBox="0 0 24 24"><path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z"/></svg>
                                    </button>
                                </div>
                                <audio src="${mediaSource}" id="audio-player-${Date.now()}" style="display:none;"></audio>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'video':
                content = `
                    <div class="quicktime-app">
                        <div class="video-container">
                            <video controls autoplay src="${mediaSource}"></video>
                        </div>
                        <div class="video-controls">
                            <button class="play-pause">Pause</button>
                            <div class="video-info">${fileName}</div>
                        </div>
                    </div>
                `;
                break;
            default:
                content = '<div>Unsupported media type</div>';
        }

        const windowElem = createCustomWindow(appName, content);
        
        // Setup special behaviors for different media types
        setTimeout(() => {
            if (mediaType === 'audio') {
                const audioId = windowElem.querySelector('audio').id;
                const playButtonId = windowElem.querySelector('.play-pause').id;
                
                const audioElement = document.getElementById(audioId);
                const playButton = document.getElementById(playButtonId);
                
                playButton.addEventListener('click', () => {
                    if (audioElement.paused) {
                        audioElement.play();
                        playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6,19H10V5H6V19M14,5V19H18V5H14Z"/></svg>';
                    } else {
                        audioElement.pause();
                        playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>';
                    }
                });
            } else if (mediaType === 'video') {
                const video = windowElem.querySelector('video');
                const playPauseBtn = windowElem.querySelector('.play-pause');
                
                playPauseBtn.addEventListener('click', () => {
                    if (video.paused) {
                        video.play();
                        playPauseBtn.textContent = 'Pause';
                    } else {
                        video.pause();
                        playPauseBtn.textContent = 'Play';
                    }
                });
            }
        }, 500);
        
        return windowElem;
    } catch (error) {
        console.error('Error creating media window:', error);
        return null;
    }
}

function loadWebApp(appName, url, secureSrc = false) {
    // Use a placeholder or message for secure content when on GitHub Pages
    const iframeSrc = secureSrc && window.location.protocol === 'https:' && window.location.hostname.includes('github.io') 
        ? 'about:blank' 
        : url;
    
    return `
        <div class="web-app">
            <div class="web-app-content">
                ${secureSrc && window.location.protocol === 'https:' && window.location.hostname.includes('github.io') 
                    ? `<div style="padding: 20px; text-align: center;">
                         <h3>External content cannot load in GitHub Pages</h3>
                         <p>This would normally load: ${url}</p>
                       </div>`
                    : `<iframe 
                        src="${iframeSrc}"
                        frameborder="0"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals"
                        allow="geolocation; microphone; camera;"
                        style="width: 100%; height: 100%; border: none;"
                       ></iframe>`
                }
            </div>
        </div>
    `;
}

function bringToFront(windowElem) {
    const windows = document.querySelectorAll('.window');
    const maxZ = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 1000)));
    windowElem.style.zIndex = maxZ + 1;
}