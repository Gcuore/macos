import { config } from './config.js';
import { initLaunchpad, toggleLaunchpad } from './launchpad.js'; 
import { initFinderWindow, initWindowDragging } from './finder.js'; 
import { initDock } from './dock.js';
import { initMail } from './mail.js';
import { initMaps } from './maps.js';
import { initPhotos } from './photos.js';  
import { initMusic } from './music.js';
import { initAppStore } from './appstore.js';
import { initSettings } from './settings.js';
import { initMessages } from './messages.js';
import { initSafari } from './safari.js';
import { initLockScreen, toggleLockScreen } from './lockscreen.js'; 
import { initWindowManager, restoreWindow } from './window-manager.js'; 
import { createAppWindow } from './window-creator.js';
import { initStageManager } from './stage-manager.js';
import { initUnlockPopup } from './unlock-popup.js';
// Import the new context menu system
import { ContextMenuSystem } from './context-menu.js';
import { NotificationSystem } from './notifications.js';

function initMenuBar() {
    try {
        const timeSpan = document.getElementById('time');
        const dateSpan = document.getElementById('date');
        const menuItems = document.querySelectorAll('.menu-item');
        const lockScreenToggle = document.querySelector('.lock-screen-toggle'); 

        lockScreenToggle.addEventListener('click', (e) => { 
            e.stopPropagation();
            toggleLockScreen();
        });

        menuItems.forEach(menuItem => {
            const dropdownMenu = menuItem.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                menuItem.addEventListener('mouseenter', () => {
                    const menuRect = menuItem.getBoundingClientRect();
                    dropdownMenu.style.left = '0';
                    dropdownMenu.style.top = '100%';
                    dropdownMenu.style.transform = 'none';
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.visibility = 'visible';
                });

                menuItem.addEventListener('mouseleave', () => {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                });

                dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        console.log(`Clicked: ${item.textContent}`);
                    });
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-bar')) {
                menuItems.forEach(menuItem => {
                    const dropdownMenu = menuItem.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.visibility = 'hidden';
                    }
                });
            }
        });

        function updateDateTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const time = `${hours}:${minutes} ${ampm}`;

            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dayName = days[now.getDay()];
            const monthName = months[now.getMonth()];
            const day = now.getDate();
            const date = `${dayName} ${monthName} ${day}`;

            timeSpan.textContent = time;
            dateSpan.textContent = date;
        }

        updateDateTime();
        setInterval(updateDateTime, 1000);
    } catch (error) {
        console.error("Error in initMenuBar:", error);
    }

    function initAppleMenu() {
        const appleMenu = document.querySelector('.apple-menu');
        const dropdownMenu = appleMenu.querySelector('.dropdown-menu');

        appleMenu.addEventListener('mouseenter', () => {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
        });

        appleMenu.addEventListener('mouseleave', () => {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
        });

        dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.textContent.trim();
                
                switch(action) {
                    case 'Lock Screen':
                        toggleLockScreen();
                        break;
                    case 'Sleep':
                        document.body.style.filter = 'brightness(0%)';
                        break;
                    case 'Force Quit...':
                        break;
                    case 'Log Out...':
                        if(confirm('Are you sure you want to log out?')) {
                            toggleLockScreen();
                        }
                        break;
                    case 'Restart...':
                        if(confirm('Are you sure you want to restart?')) {
                            location.reload();
                        }
                        break;
                    case 'Shut Down...':
                        if(confirm('Are you sure you want to shut down?')) {
                            document.body.style.filter = 'brightness(0%)';
                            setTimeout(() => {
                                document.body.innerHTML = '';
                                document.body.style.backgroundColor = 'black';
                            }, 1000);
                        }
                        break;
                    case 'System Settings...':
                        window.handleAppAction('openSettings', 'System Settings');
                        break;
                    case 'App Store...':
                        window.handleAppAction('openAppStore', 'App Store');
                        break;
                }
                
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
            });
        });
    }

    initAppleMenu();
}

function initDesktopIcons() {
    try {
        const desktopIconsContainer = document.querySelector('.desktop-icons');
        config.desktopIcons.forEach(icon => {
            const desktopIcon = document.createElement('div');
            desktopIcon.classList.add('desktop-icon');
            desktopIcon.innerHTML = `
                <img src="${icon.iconUrl}" alt="${icon.name}">
                <div class="desktop-icon-name">${icon.name}</div>
            `;
            desktopIconsContainer.appendChild(desktopIcon);
        });
    } catch (error) {
        console.error("Error in initDesktopIcons:", error);
    }
}

window.handleAppAction = async function(action, appName) {
    try {
        const windows = document.querySelectorAll('.window');
        let highestZ = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 1000)));

        const minimizedWindow = document.querySelector(`.window[data-app="${appName}"].minimized`);
        if (minimizedWindow) {
            restoreWindow(minimizedWindow);
            minimizedWindow.style.zIndex = highestZ + 1;
            return;
        }

        switch (action) {
            case 'toggleFinderWindow':
                const finderWindow = document.querySelector('.finder-window');
                finderWindow.style.display = finderWindow.style.display === 'none' ? 'block' : 'none';
                finderWindow.style.zIndex = highestZ + 1;
                break;
            case 'toggleLaunchpad':
                toggleLaunchpad();
                break;
            case 'openBrowser':
                await createAppWindow('Browser', action);
                break;
            case 'openMessages':
                await createAppWindow('Messages', action);
                break;
            case 'openMail':
                await createAppWindow('Mail', action);
                break;
            case 'openMaps':
                await createAppWindow('Maps', action);
                break;
            case 'openPhotos':
                await createAppWindow('Photos', action);
                break;
            case 'openMusic':
                await createAppWindow('Music', action);
                break;
            case 'openInstagram':
                await createAppWindow('Instagram', action);
                break;
            case 'openSpotify':
                await createAppWindow('Spotify', action);
                break;
            case 'openVSCode':
                await createAppWindow('VSCode', action);
                break;
            case 'openYoutube':
                await createAppWindow('YouTube', action);
                break;
            case 'openSettings':
                await createAppWindow('Settings', action);
                break;
        }

        const dockIcon = document.querySelector(`.dock-icon[data-name="${appName}"]`);
        if (dockIcon) {
            dockIcon.querySelector('.dock-icon-dot').style.opacity = '1';
        }
    } catch (error) {
        console.error("Error in handleAppAction:", error);
    }
};

function setupWindowControls(windowId, appName) {
    try {
        const windowElem = document.getElementById(windowId);
        const closeButton = windowElem.querySelector('.window-button.close');
        const minimizeButton = windowElem.querySelector('.window-button.minimize');
        const maximizeButton = windowElem.querySelector('.window-button.maximize');

        minimizeButton.addEventListener('click', () => {
            try {
                const dockIcon = Array.from(document.querySelectorAll('.dock-icon')).find(icon => {
                    return icon.querySelector('img').alt === appName;
                });
                if (dockIcon) {
                    const winRect = windowElem.getBoundingClientRect();
                    const dockRect = dockIcon.getBoundingClientRect();
                    const clone = windowElem.cloneNode(true);
                    clone.classList.add('window-clone');
                    clone.style.position = 'fixed';
                    clone.style.left = `${winRect.left}px`;
                    clone.style.top = `${winRect.top}px`;
                    clone.style.width = `${winRect.width}px`;
                    clone.style.height = `${winRect.height}px`;
                    
                    const targetX = dockRect.left + dockRect.width / 2 - winRect.left - winRect.width / 2;
                    const targetY = dockRect.top + dockRect.height / 2 - winRect.top - winRect.height / 2;
                    
                    clone.style.setProperty('--target-x', `${targetX}px`);
                    clone.style.setProperty('--target-y', `${targetY}px`);
                    
                    document.body.appendChild(clone);
                    
                    setTimeout(() => {
                        clone.remove();
                        windowElem.classList.add('minimized');
                        dockIcon.classList.add('active');
                    }, 400);
                }
            } catch (error) {
                console.error("Error during minimize:", error);
            }
        });
        
        closeButton.addEventListener('click', () => {
            windowElem.style.display = 'none';
            const dockIcon = document.querySelector(`.dock-icon[data-name="${appName}"]`);
            if (dockIcon) {
                dockIcon.querySelector('.dock-icon-dot').style.opacity = '0';
            }
        });

        maximizeButton.addEventListener('click', () => {
            if (!windowElem.classList.contains('maximized')) {
                windowElem.dataset.originalStyles = JSON.stringify({
                    width: windowElem.style.width,
                    height: windowElem.style.height,
                    top: windowElem.style.top,
                    left: windowElem.style.left,
                    transform: windowElem.style.transform
                });
                
                windowElem.classList.add('maximized');
            } else {
                const originalStyles = JSON.parse(windowElem.dataset.originalStyles);
                windowElem.classList.remove('maximized');
                Object.assign(windowElem.style, originalStyles);
            }

            const windows = document.querySelectorAll('.window');
            const highestZ = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 1000)));
            windowElem.style.zIndex = highestZ + 1;
        });

    } catch (error) {
        console.error("Error in setupWindowControls:", error);
    }
}

window.togglePlay = function () {
    try {
        const audio = document.getElementById('music-player');
        const button = document.querySelector('.play-pause svg');
        if (audio.paused) {
            audio.play();
            button.innerHTML = '<path d="M6 4h4v16H6zm8 0h4v16h-4z"/>';
        } else {
            audio.pause();
            button.innerHTML = '<path d="M8 5v14l11-7z"/>';
        }
    } catch (error) {
        console.error("Error in togglePlay:", error);
    }
};

window.nextTrack = function () {
    try {
        const tracks = document.querySelectorAll('.track');
        const current = document.querySelector('.track.active');
        const index = Array.from(tracks).indexOf(current);
        current.classList.remove('active');
        tracks[(index + 1) % tracks.length].classList.add('active');
    } catch (error) {
        console.error("Error in nextTrack:", error);
    }
};

function initControlCenter() {
    try {
        const controlCenterIcon = document.querySelector('.control-center');
        const controlCenterPanel = document.querySelector('.control-center-panel');
        
        controlCenterIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            controlCenterPanel.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-center-panel') && !e.target.closest('.control-center')) {
                controlCenterPanel.classList.remove('show');
            }
        });

        const controlButtons = controlCenterPanel.querySelectorAll('.control-button');
        controlButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.classList.contains('span-2')) {
                    button.classList.toggle('active');
                }
            });
        });

        const brightnessSlider = controlCenterPanel.querySelector('.brightness-slider input');
        brightnessSlider.addEventListener('input', (e) => {
            document.body.style.filter = `brightness(${e.target.value}%)`;
        });

        const volumeSlider = controlCenterPanel.querySelector('.volume-slider input');
        volumeSlider.addEventListener('input', (e) => {
            console.log('Volume:', e.target.value);
        });

    } catch (error) {
        console.error("Error in initControlCenter:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Fix background image for GitHub Pages
    const baseUrl = window.location.pathname.includes('/macos-web') ? '/macos-web' : '';
    document.querySelector('.desktop').style.backgroundImage = `url('${baseUrl}/SequoiaDark.png')`;
    
    initMenuBar();
    initDock();
    initDesktopIcons();
    initFinderWindow();
    initLaunchpad();
    initControlCenter();
    initLockScreen();
    initStageManager();

    const stageToggle = document.querySelector('.menu-icon.stage-toggle-label');
    if (stageToggle) {
        stageToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            import('./stage-manager.js').then(mod => mod.toggleStageManager());
        });
    }

    initUnlockPopup();
    
    window.contextMenuSystem = new ContextMenuSystem();
    
    window.NotificationSystem = NotificationSystem;
    
    document.querySelector('.desktop').addEventListener('contextmenu', (e) => {
        if (e.target.closest('.desktop-icon') || e.target.closest('.window') || 
            e.target.closest('.dock') || e.target.closest('.menu-bar')) {
            return; 
        }
        
        e.preventDefault();
        window.contextMenuSystem.showContextMenu(e.clientX, e.clientY, [
            {
                label: 'New Folder',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>',
                action: () => {
                    const desktopIcons = document.querySelector('.desktop-icons');
                    const newFolder = document.createElement('div');
                    newFolder.className = 'desktop-icon';
                    newFolder.innerHTML = `
                        <img src="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/e2f0bf04b50bb5e964833fa735992c97_folder.png" alt="New Folder">
                        <div class="desktop-icon-name" contenteditable="true">New Folder</div>
                    `;
                    desktopIcons.appendChild(newFolder);
                    
                    setTimeout(() => {
                        const nameElement = newFolder.querySelector('.desktop-icon-name');
                        nameElement.focus();
                        const range = document.createRange();
                        range.selectNodeContents(nameElement);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                        
                        nameElement.addEventListener('blur', () => {
                            nameElement.contentEditable = false;
                        });
                    }, 100);
                }
            },
            {
                label: 'Change Desktop Background',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" /></svg>',
                action: () => {
                    const desktop = document.querySelector('.desktop');
                    const backgrounds = [
                        '/SequoiaDark.png',
                        'https://wallpaperaccess.com/full/1638001.jpg',
                        'https://wallpaperaccess.com/full/3277616.jpg',
                        'https://wallpaperaccess.com/full/5736319.jpg'
                    ];
                    
                    const currentBg = desktop.style.backgroundImage;
                    const currentIndex = backgrounds.findIndex(bg => currentBg.includes(bg.replace(/\//g, '\\/')));
                    const nextIndex = (currentIndex + 1) % backgrounds.length;
                    
                    desktop.style.transition = 'background-image 1s ease';
                    desktop.style.backgroundImage = `url(${backgrounds[nextIndex]})`;
                }
            }
        ]);
    });

    document.querySelectorAll('.dock-icon').forEach(icon => {
        icon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const appName = icon.getAttribute('data-name');
            const action = window.config.dockIcons.find(dockIcon => dockIcon.name === appName)?.action;
            
            window.contextMenuSystem.showContextMenu(e.clientX, e.clientY, [
                {
                    label: 'Open',
                    icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" /></svg>',
                    action: () => window.handleAppAction(action, appName)
                },
                {
                    label: 'Open in New Window',
                    icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,4H5A2,2 0 0,0 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C22,4.89 21.1,4 20,4Z"/></svg>',
                    action: () => window.handleAppAction(action, `${appName} (New)`)
                },
                { separator: true },
                {
                    label: 'Unpin from Dock',
                    icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M17.46,15.89L8.57,7H9.8L18.69,15.89M10,4H6V2H10M10,11H6V9H10M10,18H6V16H10M14,4H12V2H14M14,11H12V9H14M14,18H12V16H14M18,4H16V2H18M18,11H16V9H18M18,18H16V16H18V18Z" /></svg>',
                    action: () => {
                        icon.style.opacity = '0.5';
                        icon.style.transform = 'scale(0.8)';
                        
                        setTimeout(() => {
                            icon.style.opacity = '1';
                            icon.style.transform = '';
                        }, 1500);
                    }
                }
            ]);
        });
    });

    import('./file-uploader.js').then(module => {
        const { FileUploader } = module;
        window.fileUploader = new FileUploader();
    });
});