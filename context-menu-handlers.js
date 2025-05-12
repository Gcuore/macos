// Update context-menu-handlers.js to work better with finder
import { FileHandler } from './file-handler.js';

export class ContextMenuHandlers {
    constructor(contextMenuSystem) {
        this.contextMenuSystem = contextMenuSystem;
        this.fileUploader = null;
    }
    
    setFileUploader(fileUploader) {
        this.fileUploader = fileUploader;
    }
    
    // Desktop context menu handlers
    handleDesktopContextMenu(e) {
        if (!this.contextMenuSystem) return;
        
        this.contextMenuSystem.showContextMenu(e.clientX, e.clientY, [
            {
                label: 'New Folder',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>',
                action: () => this.createNewFolder()
            },
            {
                label: 'Change Desktop Background',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" /></svg>',
                action: () => this.changeDesktopBackground()
            },
            {
                label: 'Upload File',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" /></svg>',
                action: () => this.uploadFile()
            }
        ]);
    }
    
    createNewFolder() {
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
    
    changeDesktopBackground() {
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
    
    uploadFile() {
        if (this.fileUploader) {
            this.fileUploader.openFileDialog();
        } else {
            console.error('File uploader not initialized');
        }
    }

    // Finder context menu handlers
    openNewFinderWindow() {
        window.handleAppAction('toggleFinderWindow', 'Finder');
    }

    createFinderFolder() {
        const mainContent = document.querySelector('.finder-window .main-content');
        const newFolder = document.createElement('div');
        newFolder.className = 'file-icon';
        newFolder.innerHTML = `
            <img src="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/e2f0bf04b50bb5e964833fa735992c97_folder.png" alt="New Folder">
            <div class="file-name" contenteditable="true">New Folder</div>
        `;
        mainContent.appendChild(newFolder);
        
        setTimeout(() => {
            const nameElement = newFolder.querySelector('.file-name');
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

    finderUploadFile() {
        if (this.fileUploader) {
            this.fileUploader.openFileDialog('.finder-window .main-content');
        } else {
            console.error('File uploader not initialized');
        }
    }

    changeFinderView(viewType) {
        const mainContent = document.querySelector('.finder-window .main-content');
        
        if (viewType === 'icons') {
            mainContent.classList.remove('list-view');
            mainContent.classList.add('icon-view');
        } else if (viewType === 'list') {
            mainContent.classList.remove('icon-view');
            mainContent.classList.add('list-view');
        }
    }

    customizeFinder() {
        import('./window-creator.js').then(module => {
            module.createAppWindow('Settings', 'openSettings');
        });
    }

    // Dock icon context menu handlers
    openApp(appName, action) {
        window.handleAppAction(action, appName);
    }

    openInNewWindow(appName, action) {
        window.handleAppAction(action, appName + ' (New)');
    }

    unpinFromDock(dockIcon) {
        dockIcon.style.opacity = '0.5';
        dockIcon.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            dockIcon.style.opacity = '1';
            dockIcon.style.transform = '';
        }, 1500);
    }

    // File handling
    openFile(fileName, iconElement) {
        import('./file-associations.js').then(module => {
            const { FileAssociations } = module;
            FileAssociations.openFile(fileName, iconElement);
        });
    }

    getFileInfo(fileName) {
        const notificationSystem = new window.NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
            tag: 'Finder',
            title: 'Item Info',
            message: `"${fileName}" - Created today`,
            timeout: 3000
        });
    }

    renameFile(element) {
        const nameElement = element.querySelector('.file-name') || element.querySelector('.desktop-icon-name');
        if (nameElement) {
            nameElement.contentEditable = true;
            nameElement.focus();
            
            const range = document.createRange();
            range.selectNodeContents(nameElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            nameElement.addEventListener('blur', () => {
                nameElement.contentEditable = false;
            });
        }
    }

    moveToTrash(element) {
        element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        element.style.transform = 'scale(0.5)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.remove();
        }, 300);
    }
}