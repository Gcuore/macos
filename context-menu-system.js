// New file created to offload functionality from context-menu.js
export class ContextMenuSystemExtension {
    constructor(mainSystem) {
        this.mainSystem = mainSystem;
    }
    
    showFileContextMenu(e, fileIcon) {
        const fileName = fileIcon.dataset.name;
        const fileType = fileIcon.dataset.type;
        
        this.mainSystem.showContextMenu(e.clientX, e.clientY, [
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
}