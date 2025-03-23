import { initWindowManager } from './window-manager.js';
import { config } from './config.js';
import { initFinderActions } from './finder-actions.js';

let currentFinderSection = 'Favorites'; 

export function initFinderWindow() {
    try {
        const finderWindow = document.querySelector('.finder-window');
        initWindowManager(finderWindow); 
        const header = finderWindow.querySelector('.window-header');
        const closeButton = finderWindow.querySelector('.window-button.close');
        const sidebarItems = finderWindow.querySelectorAll('.sidebar-item');

        closeButton.addEventListener('click', () => {
            finderWindow.style.display = 'none';
        });

        // Add event listeners to sidebar items
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                currentFinderSection = item.querySelector('span').textContent; 
                populateFinder(currentFinderSection); 
                sidebarItems.forEach(si => si.classList.remove('active')); 
                item.classList.add('active'); 
            });
        });
        sidebarItems[0].classList.add('active'); 

        populateFinder(currentFinderSection);
        
        // Initialize finder actions
        initFinderActions();
    } catch (error) {
        console.error("Error in initFinderWindow:", error);
    }
}

function populateFinder(section) {
    try {
        const mainContent = document.querySelector('.finder-window .main-content');
        mainContent.innerHTML = ''; 

        let filesToDisplay = [];

        // Placeholder logic for different sections - replace with actual data fetching or config if needed
        switch (section) {
            case 'Recents':
                filesToDisplay = config.finderFiles; 
                break;
            case 'Documents':
                filesToDisplay = config.finderFiles.filter(file => file.type === 'file'); 
                break;
            case 'Downloads':
                filesToDisplay = config.finderFiles.filter(file => file.type === 'folder'); 
                break;
            case 'Home':
                filesToDisplay = [{ name: "Home Folder", iconUrl: "https://macosicons.com/api/icons/Folder_macos_Monterey/auto", type: "folder" }]; 
                break;
            default:
                filesToDisplay = config.finderFiles; 
        }


        filesToDisplay.forEach(file => {
            const fileIcon = document.createElement('div');
            fileIcon.classList.add('file-icon');
            fileIcon.innerHTML = `
                <img src="${file.iconUrl}" alt="${file.name}">
                <div class="file-name">${file.name}</div>
            `;
            mainContent.appendChild(fileIcon);
        });
    } catch (error) {
        console.error("Error in populateFinder:", error);
    }
}

export function initWindowDragging(windowElem) {
    const header = windowElem.querySelector('.window-header');
    if (!header) return;
    header.style.cursor = 'move';
    header.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        // Use the current left/top values; if not set inline, use getBoundingClientRect()
        const origLeft = parseInt(windowElem.style.left, 10) || windowElem.getBoundingClientRect().left;
        const origTop = parseInt(windowElem.style.top, 10) || windowElem.getBoundingClientRect().top;
        function onPointerMove(e) {
            windowElem.style.left = (origLeft + (e.clientX - startX)) + 'px';
            windowElem.style.top = (origTop + (e.clientY - startY)) + 'px';
        }
        function onPointerUp() {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        }
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    });
}