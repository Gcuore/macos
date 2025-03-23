import { config } from './config.js';
import { initLaunchpad, toggleLaunchpad } from './launchpad.js'; // Import launchpad functions
import { initFinderWindow, initWindowDragging } from './finder.js'; // Import Finder functions and initWindowDragging
import { initDock } from './dock.js';
import { initMail } from './mail.js';
import { initMaps } from './maps.js';
import { initPhotos } from './photos.js';  
import { initMusic } from './music.js';
import { initAppStore } from './appstore.js';
import { initSettings } from './settings.js';
import { initMessages } from './messages.js';
import { initSafari } from './safari.js';
import { initLockScreen, toggleLockScreen } from './lockscreen.js'; // Import lockscreen functions
import { initWindowManager } from './window-manager.js';
import { createAppWindow } from './window-creator.js';

function initMenuBar() {
    try {
        const timeSpan = document.getElementById('time');
        const dateSpan = document.getElementById('date');
        const menuItems = document.querySelectorAll('.menu-item');
        const lockScreenToggle = document.querySelector('.lock-screen-toggle'); // Lock screen toggle icon

        lockScreenToggle.addEventListener('click', (e) => { // Add event listener for lock screen toggle
            e.stopPropagation();
            toggleLockScreen();
        });

        menuItems.forEach(menuItem => {
            const dropdownMenu = menuItem.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                // Position dropdown menu relative to menu item
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

                // Handle click events on dropdown items
                dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        console.log(`Clicked: ${item.textContent}`);
                    });
                });
            }
        });

        // Only close dropdowns when clicking outside menu bar area
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

        // Show menu on hover
        appleMenu.addEventListener('mouseenter', () => {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
        });

        appleMenu.addEventListener('mouseleave', () => {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
        });

        // Handle menu items
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
                        // You could show a force quit dialog here
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
            case 'openAppStore':
                await createAppWindow('AppStore', action);
                break;
            case 'openSettings':
                await createAppWindow('Settings', action);
                break;
        }

        // Update dock icon state
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
                // Store current window position and size before maximizing
                windowElem.dataset.originalStyles = JSON.stringify({
                    width: windowElem.style.width,
                    height: windowElem.style.height,
                    top: windowElem.style.top,
                    left: windowElem.style.left,
                    transform: windowElem.style.transform
                });
                
                windowElem.classList.add('maximized');
            } else {
                // Restore original window position and size
                const originalStyles = JSON.parse(windowElem.dataset.originalStyles);
                windowElem.classList.remove('maximized');
                Object.assign(windowElem.style, originalStyles);
            }

            // Ensure window is at the front
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
    initMenuBar();
    initDock();
    initDesktopIcons();
    initFinderWindow();
    initLaunchpad();
    initControlCenter();
    initLockScreen(); 
});