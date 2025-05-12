// Context menu system for macOS simulation
export class ContextMenuSystem {
    constructor() {
        this.initContextMenu();
        this.setupEventListeners();
    }

    initContextMenu() {
        // Create context menu container if it doesn't exist
        let container = document.getElementById('context-menu-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'context-menu-container';
            document.body.appendChild(container);
        }
    }

    setupEventListeners() {
        // Hide context menu on any click
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // Prevent default context menu and show custom one
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.hideContextMenu();
            
            // Check what element was right-clicked
            const target = e.target;
            
            // Desktop right-click
            if (target.closest('.desktop') && !target.closest('.window') && 
                !target.closest('.dock') && !target.closest('.menu-bar') && 
                !target.closest('.desktop-icon')) {
                this.showDesktopContextMenu(e.clientX, e.clientY);
            } 
            // Finder right-click
            else if (target.closest('.finder-window')) {
                this.showFinderContextMenu(e.clientX, e.clientY);
            }
            // Dock icon right-click
            else if (target.closest('.dock-icon')) {
                const dockIcon = target.closest('.dock-icon');
                this.showDockIconContextMenu(e.clientX, e.clientY, dockIcon);
            }
            // Desktop icon right-click
            else if (target.closest('.desktop-icon')) {
                const desktopIcon = target.closest('.desktop-icon');
                this.showDesktopIconContextMenu(e.clientX, e.clientY, desktopIcon);
            }
            // File right-click
            else if (target.closest('.file-icon')) {
                const fileIcon = target.closest('.file-icon');
                this.showFileContextMenu(e, fileIcon);
            }
        });
    }

    showContextMenu(x, y, items) {
        const container = document.getElementById('context-menu-container');
        
        // Create menu element
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        
        // Add menu items
        items.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                menu.appendChild(separator);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = 'context-menu-item';
                if (item.disabled) menuItem.classList.add('disabled');
                
                menuItem.innerHTML = `
                    ${item.icon ? `<div class="context-menu-item-icon">${item.icon}</div>` : ''}
                    <div class="context-menu-item-label">${item.label}</div>
                `;
                
                if (!item.disabled) {
                    menuItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.hideContextMenu();
                        if (typeof item.action === 'function') {
                            item.action();
                        }
                    });
                }
                
                menu.appendChild(menuItem);
            }
        });
        
        // Add to container
        container.innerHTML = '';
        container.appendChild(menu);
    }

    hideContextMenu() {
        const container = document.getElementById('context-menu-container');
        if (container) {
            container.innerHTML = '';
        }
    }

    showDesktopContextMenu(x, y) {
        this.showContextMenu(x, y, [
            {
                label: 'New Folder',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>',
                action: () => this.createNewFolder()
            },
            {
                label: 'New File',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H18V20Z" /></svg>',
                action: () => this.createNewFile()
            },
            { separator: true },
            {
                label: 'Change Desktop Background',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" /></svg>',
                action: () => this.changeDesktopBackground()
            },
            { separator: true },
            {
                label: 'Sort By',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z" /></svg>',
                disabled: true
            }
        ]);
    }

    showFinderContextMenu(x, y) {
        this.showContextMenu(x, y, [
            {
                label: 'New Finder Window',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>',
                action: () => window.handleAppAction('toggleFinderWindow', 'Finder')
            },
            {
                label: 'New Folder',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>',
                action: () => this.createNewFolder()
            },
            { separator: true },
            {
                label: 'View as Icons',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M3,3H11V11H3V3M13,3H21V11H13V3M3,13H11V21H3V13M13,13H21V21H13V13Z" /></svg>',
                action: () => this.changeFinderView('icons')
            },
            {
                label: 'View as List',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z" /></svg>',
                action: () => this.changeFinderView('list')
            },
            { separator: true },
            {
                label: 'Customize Finder',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" /></svg>',
                action: () => this.customizeFinder()
            }
        ]);
    }

    showDockIconContextMenu(x, y, dockIcon) {
        const appName = dockIcon.getAttribute('data-name');
        const action = window.config.dockIcons.find(icon => icon.name === appName)?.action;
        
        this.showContextMenu(x, y, [
            {
                label: 'Open',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" /></svg>',
                action: () => window.handleAppAction(action, appName)
            },
            {
                label: 'Open in New Window',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,4H5A2,2 0 0,0 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6A2,2 0 0,0 19,4M13,8H15V10H13V8M13,12H15V14H13V12M13,16H15V18H13V16M5,8H11V14H5V8M5,16H11V18H5V16M19,18H17V16H19V18M19,14H17V12H19V14M19,10H17V8H19V10Z" /></svg>',
                action: () => this.openInNewWindow(appName, action)
            },
            { separator: true },
            {
                label: 'Unpin from Dock',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M17.46,15.89L8.57,7H9.8L18.69,15.89M10,4H6V2H10M10,11H6V9H10M10,18H6V16H10M14,4H12V2H14M14,11H12V9H14M14,18H12V16H14M18,4H16V2H18M18,11H16V9H18M18,18H16V16H18V18Z" /></svg>',
                action: () => this.unpinFromDock(dockIcon)
            }
        ]);
    }

    showDesktopIconContextMenu(x, y, desktopIcon) {
        const iconName = desktopIcon.querySelector('.desktop-icon-name').textContent;
        
        this.showContextMenu(x, y, [
            {
                label: 'Open',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" /></svg>',
                action: () => this.openDesktopIcon(iconName)
            },
            {
                label: 'Open With',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,4H14.82C14.4,2.84 13.3,2 12,2C10.7,2 9.6,2.84 9.18,4H5A2,2 0 0,0 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M12,4A1,1 0 0,1 13,5A1,1 0 0,1 12,6A1,1 0 0,1 11,5A1,1 0 0,1 12,4M7,8H17V6H19V20H5V6H7V8Z" /></svg>',
                disabled: true
            },
            { separator: true },
            {
                label: 'Get Info',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>',
                action: () => this.getIconInfo(iconName)
            },
            {
                label: 'Rename',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg>',
                action: () => this.renameIcon(desktopIcon)
            },
            {
                label: 'Move to Trash',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>',
                action: () => this.moveToTrash(desktopIcon)
            }
        ]);
    }

    showFileContextMenu(e, fileIcon) {
        const fileName = fileIcon.dataset.name;
        const fileType = fileIcon.dataset.type;
        
        this.showContextMenu(e.clientX, e.clientY, [
            {
                label: 'Open',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" /></svg>',
                action: () => {
                    import('./file-handler.js').then(module => {
                        const { FileHandler } = module;
                        FileHandler.handleFileOpen({name: fileName, type: fileType});
                    });
                }
            },
            {
                label: 'Get Info',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>',
                action: () => {
                    const notification = new window.NotificationSystem();
                    notification.show({
                        icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
                        tag: 'Finder',
                        title: 'File Info',
                        message: `${fileName} - Type: ${fileType}`,
                        timeout: 3000
                    });
                }
            },
            { separator: true },
            {
                label: 'Rename',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg>',
                action: () => {
                    const nameElement = fileIcon.querySelector('.file-name');
                    nameElement.contentEditable = true;
                    nameElement.focus();
                    
                    const range = document.createRange();
                    range.selectNodeContents(nameElement);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    nameElement.addEventListener('blur', () => {
                        nameElement.contentEditable = false;
                        fileIcon.dataset.name = nameElement.textContent;
                    });
                }
            },
            {
                label: 'Move to Trash',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>',
                action: () => {
                    fileIcon.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    fileIcon.style.transform = 'scale(0.5)';
                    fileIcon.style.opacity = '0';
                    
                    setTimeout(() => {
                        fileIcon.remove();
                    }, 300);
                }
            }
        ]);
    }

    // Utility functions for actions
    createNewFolder() {
        const notificationSystem = new NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
            tag: 'Finder',
            title: 'New Folder',
            message: 'Creating a new folder',
            timeout: 3000
        });
        
        // Add folder to desktop
        const desktopIcons = document.querySelector('.desktop-icons');
        const newFolder = document.createElement('div');
        newFolder.className = 'desktop-icon';
        newFolder.innerHTML = `
            <img src="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/e2f0bf04b50bb5e964833fa735992c97_folder.png" alt="New Folder">
            <div class="desktop-icon-name" contenteditable="true">New Folder</div>
        `;
        desktopIcons.appendChild(newFolder);
        
        // Focus on name for editing
        setTimeout(() => {
            const nameElement = newFolder.querySelector('.desktop-icon-name');
            nameElement.focus();
            
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(nameElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Add blur event to save name
            nameElement.addEventListener('blur', () => {
                nameElement.contentEditable = false;
            });
        }, 100);
    }

    createNewFile() {
        const notificationSystem = new NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c0b761fc19488f0b4d2311f29b71ba01_low_res_Photos.png',
            tag: 'Finder',
            title: 'New File',
            message: 'Creating a new file',
            timeout: 3000
        });
        
        // Add file to desktop
        const desktopIcons = document.querySelector('.desktop-icons');
        const newFile = document.createElement('div');
        newFile.className = 'desktop-icon';
        newFile.innerHTML = `
            <img src="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/d7febe6b9ed1d06d935640ae57a3d93a_file.png" alt="New File">
            <div class="desktop-icon-name" contenteditable="true">New File.txt</div>
        `;
        desktopIcons.appendChild(newFile);
        
        // Focus on name for editing
        setTimeout(() => {
            const nameElement = newFile.querySelector('.desktop-icon-name');
            nameElement.focus();
            
            // Select text before extension
            const text = nameElement.textContent;
            const dotIndex = text.lastIndexOf('.');
            
            if (dotIndex > 0) {
                const range = document.createRange();
                range.setStart(nameElement.firstChild, 0);
                range.setEnd(nameElement.firstChild, dotIndex);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            // Add blur event to save name
            nameElement.addEventListener('blur', () => {
                nameElement.contentEditable = false;
            });
        }, 100);
    }

    changeDesktopBackground() {
        // Show notification
        const notificationSystem = new NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9b23bcaafd4c81fa40685736c9d2cac1_2DLff7nlvI.png',
            tag: 'System',
            title: 'Desktop Background',
            message: 'Background changing simulation',
            timeout: 3000
        });
        
        // Simulate background change with animation
        const desktop = document.querySelector('.desktop');
        desktop.style.transition = 'background-image 1s ease';
        
        // Cycle through background options
        const backgrounds = [
            '/SequoiaDark.png',
            'https://wallpaperaccess.com/full/1638001.jpg',
            'https://wallpaperaccess.com/full/3277616.jpg',
            'https://wallpaperaccess.com/full/5736319.jpg'
        ];
        
        const currentBg = desktop.style.backgroundImage;
        const currentIndex = backgrounds.findIndex(bg => currentBg.includes(bg.replace(/\//g, '\\/')));
        const nextIndex = (currentIndex + 1) % backgrounds.length;
        
        desktop.style.backgroundImage = `url(${backgrounds[nextIndex]})`;
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
        
        // Show notification
        const notificationSystem = new NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
            tag: 'Finder',
            title: 'View Changed',
            message: `Changed to ${viewType} view`,
            timeout: 2000
        });
    }

    customizeFinder() {
        import('./window-creator.js').then(module => {
            module.createAppWindow('Settings', 'openSettings');
        });
    }

    openInNewWindow(appName, action) {
        window.handleAppAction(action, appName + ' (New)');
    }

    unpinFromDock(dockIcon) {
        // Show notification about the feature
        const notificationSystem = new NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9b23bcaafd4c81fa40685736c9d2cac1_2DLff7nlvI.png',
            tag: 'System',
            title: 'Dock',
            message: 'Unpinning apps is simulated',
            timeout: 3000
        });
        
        // Simulate unpinning with animation
        dockIcon.style.opacity = '0.5';
        dockIcon.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            dockIcon.style.opacity = '1';
            dockIcon.style.transform = '';
        }, 1500);
    }

    openDesktopIcon(iconName) {
        // Determine which app to open based on the icon name
        let action, appName;
        
        if (iconName.endsWith('.txt')) {
            action = 'openBrowser';
            appName = 'Text Editor';
        } else if (iconName.includes('Folder')) {
            action = 'toggleFinderWindow';
            appName = 'Finder';
        } else {
            action = 'toggleFinderWindow';
            appName = 'Finder';
        }
        
        window.handleAppAction(action, appName);
    }

    getIconInfo(iconName) {
        // Show notification with icon info
        const notificationSystem = new NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
            tag: 'Finder',
            title: 'Item Info',
            message: `"${iconName}" - Created today`,
            timeout: 3000
        });
    }

    renameIcon(iconElement) {
        const nameElement = iconElement.querySelector('.desktop-icon-name');
        nameElement.contentEditable = true;
        nameElement.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(nameElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Add blur event to save name
        nameElement.addEventListener('blur', () => {
            nameElement.contentEditable = false;
        });
    }

    moveToTrash(iconElement) {
        // Show notification
        const notificationSystem = new NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
            tag: 'Finder',
            title: 'Trash',
            message: 'Item moved to Trash',
            timeout: 2000
        });
        
        // Animate and remove the icon
        iconElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        iconElement.style.transform = 'scale(0.5)';
        iconElement.style.opacity = '0';
        
        setTimeout(() => {
            iconElement.remove();
        }, 300);
    }
}