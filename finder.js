import { initWindowManager } from './window-manager.js';
import { config } from './config.js';
import { FinderNavigation } from './finder-navigation.js';
import { ContextMenuSystem } from './context-menu.js';

export function initFinderWindow() {
    try {
        const finderWindow = document.querySelector('.finder-window');
        initWindowManager(finderWindow); 
        
        // Initialize finder navigation
        window.finderNavigation = new FinderNavigation();
        
        // Setup event listeners
        const sidebarItems = finderWindow.querySelectorAll('.sidebar-item');
        const backButton = finderWindow.querySelector('.toolbar-icon.back');
        const forwardButton = finderWindow.querySelector('.toolbar-icon.forward');
        const searchInput = finderWindow.querySelector('.search-bar input');
        const closeButton = finderWindow.querySelector('.window-button.close');

        closeButton.addEventListener('click', () => {
            finderWindow.style.display = 'none';
        });

        // Add event listeners to sidebar items
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                window.finderNavigation.navigateToSection(item.querySelector('span').textContent);
            });
        });
        
        // Add navigation button functionality
        backButton.addEventListener('click', () => {
            window.finderNavigation.navigateBack();
        });
        
        forwardButton.addEventListener('click', () => {
            window.finderNavigation.navigateForward();
        });
        
        // Add search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const fileIcons = finderWindow.querySelectorAll('.file-icon');
            
            fileIcons.forEach(icon => {
                const fileName = icon.querySelector('.file-name').textContent.toLowerCase();
                icon.style.display = fileName.includes(searchTerm) ? 'flex' : 'none';
            });
        });
        
        // Set initial state
        sidebarItems[0].classList.add('active'); 
        window.finderNavigation.populateFinder(window.finderNavigation.currentSection);
        
        // Add upload button to toolbar
        addUploadButton(finderWindow);
        
        // Setup context menu
        setupFinderContextMenu(finderWindow);
    } catch (error) {
        console.error("Error in initFinderWindow:", error);
    }
}

function addUploadButton(finderWindow) {
    const toolbar = finderWindow.querySelector('.window-toolbar');
    
    if (toolbar) {
        const uploadButton = document.createElement('div');
        uploadButton.className = 'toolbar-icon upload';
        uploadButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
            </svg>
        `;
        
        uploadButton.addEventListener('click', () => {
            if (window.fileUploader) {
                window.fileUploader.openFileDialog('.finder-window .main-content');
            } else {
                import('./file-uploader.js').then(module => {
                    const { FileUploader } = module;
                    window.fileUploader = new FileUploader();
                    window.fileUploader.openFileDialog('.finder-window .main-content');
                });
            }
        });
        
        toolbar.insertBefore(uploadButton, toolbar.querySelector('.search-bar'));
    }
}

function setupFinderContextMenu(finderWindow) {
    const mainContent = finderWindow.querySelector('.main-content');
    
    // Only set up if it doesn't already have handlers
    if (!mainContent.hasContextMenu) {
        mainContent.hasContextMenu = true;
        
        mainContent.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            const fileIcon = e.target.closest('.file-icon');
            
            if (window.contextMenuSystem) {
                if (fileIcon) {
                    showFileContextMenu(e, fileIcon);
                } else {
                    showEmptyAreaContextMenu(e);
                }
            } else {
                console.error('Context menu system not initialized');
            }
        });
    }
}

function showFileContextMenu(e, fileIcon) {
    const fileName = fileIcon.dataset.name;
    const fileType = fileIcon.dataset.type;
    
    window.contextMenuSystem.showContextMenu(e.clientX, e.clientY, [
        {
            label: 'Open',
            icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" /></svg>',
            action: () => {
                // Handle opening the file
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
                // Show notification with file info
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
                
                // Select all text
                const range = document.createRange();
                range.selectNodeContents(nameElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                
                // Add blur event to save the new name
                nameElement.addEventListener('blur', () => {
                    nameElement.contentEditable = false;
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

function showEmptyAreaContextMenu(e) {
    window.contextMenuSystem.showContextMenu(e.clientX, e.clientY, [
        {
            label: 'New Folder',
            icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>',
            action: () => {
                // Create new folder
                import('./file-handler.js').then(module => {
                    const { FileHandler } = module;
                    
                    const mainContent = document.querySelector('.finder-window .main-content');
                    const newFolder = document.createElement('div');
                    newFolder.className = 'file-icon';
                    newFolder.dataset.type = 'folder';
                    newFolder.dataset.name = 'New Folder';
                    
                    const iconUrl = FileHandler.getIconForFile('folder', 'folder');
                    
                    newFolder.innerHTML = `
                        <img src="${iconUrl}" alt="New Folder">
                        <div class="file-name" contenteditable="true">New Folder</div>
                    `;
                    
                    mainContent.appendChild(newFolder);
                    
                    setTimeout(() => {
                        const nameElement = newFolder.querySelector('.file-name');
                        nameElement.focus();
                        
                        // Select all text
                        const range = document.createRange();
                        range.selectNodeContents(nameElement);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                        
                        // Add blur event to save the new name
                        nameElement.addEventListener('blur', () => {
                            nameElement.contentEditable = false;
                            newFolder.dataset.name = nameElement.textContent;
                        });
                    }, 100);
                });
            }
        },
        {
            label: 'Upload File',
            icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" /></svg>',
            action: () => {
                if (window.fileUploader) {
                    window.fileUploader.openFileDialog('.finder-window .main-content');
                } else {
                    import('./file-uploader.js').then(module => {
                        const { FileUploader } = module;
                        window.fileUploader = new FileUploader();
                        window.fileUploader.openFileDialog('.finder-window .main-content');
                    });
                }
            }
        },
        { separator: true },
        {
            label: 'View as Icons',
            icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M3,3H11V11H3V3M13,3H21V11H13V3M3,13H11V21H3V13M13,13H21V21H13V13Z" /></svg>',
            action: () => {
                const mainContent = document.querySelector('.finder-window .main-content');
                mainContent.classList.remove('list-view');
                mainContent.classList.add('icon-view');
            }
        },
        {
            label: 'View as List',
            icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z" /></svg>',
            action: () => {
                const mainContent = document.querySelector('.finder-window .main-content');
                mainContent.classList.remove('icon-view');
                mainContent.classList.add('list-view');
            }
        },
        { separator: true },
        {
            label: 'Customize Finder',
            icon: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" /></svg>',
            action: () => {
                import('./window-creator.js').then(module => {
                    module.createAppWindow('Settings', 'openSettings');
                });
            }
        }
    ]);
}

export function initWindowDragging(windowElem) {
    // This function is kept for backward compatibility
    // Most functionality now handled by window-manager.js
}