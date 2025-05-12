export class FileUploader {
    constructor() {
        this.setupDragAndDrop();
        this.fileInput = this.createFileInput();
        document.body.appendChild(this.fileInput);
    }
    
    createFileInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.style.display = 'none';
        
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const targetContainer = this.fileInput.dataset.targetContainer;
            const container = document.querySelector(targetContainer) || document.querySelector('.desktop-icons');
            
            this.handleFiles(files, container);
        });
        
        return input;
    }
    
    openFileDialog(targetContainer = '.desktop-icons') {
        this.fileInput.dataset.targetContainer = targetContainer;
        this.fileInput.value = '';
        this.fileInput.click();
    }
    
    setupDragAndDrop() {
        const desktop = document.querySelector('.desktop');
        const finderWindow = document.querySelector('.finder-window');
        
        const containers = [desktop, finderWindow];
        
        containers.forEach(container => {
            if (!container) return;
            
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                container.classList.add('drag-over');
            });
            
            container.addEventListener('dragleave', () => {
                container.classList.remove('drag-over');
            });
            
            container.addEventListener('drop', (e) => {
                e.preventDefault();
                container.classList.remove('drag-over');
                
                const files = Array.from(e.dataTransfer.files);
                let targetContainer;
                
                if (container === desktop) {
                    targetContainer = document.querySelector('.desktop-icons');
                } else if (container === finderWindow) {
                    targetContainer = finderWindow.querySelector('.main-content');
                }
                
                if (targetContainer && files.length > 0) {
                    this.handleFiles(files, targetContainer);
                }
            });
        });
    }
    
    handleFiles(files, container) {
        files.forEach(file => {
            const fileIcon = this.createFileIcon(file, container);
            container.appendChild(fileIcon);
        });
        
        this.showUploadNotification(files);
    }

    createFileIcon(file, container) {
        const fileIcon = document.createElement('div');
        fileIcon.className = container.classList.contains('desktop-icons') ? 'desktop-icon' : 'file-icon';
        fileIcon.dataset.type = this.getFileType(file);
        fileIcon.dataset.name = file.name;
        
        const iconUrl = this.getIconForFile(file);
        fileIcon.innerHTML = `
            <img src="${iconUrl}" alt="${file.name}">
            <div class="${container.classList.contains('desktop-icons') ? 'desktop-icon-name' : 'file-name'}">${file.name}</div>
        `;
        
        // Store actual file object and handle preview/interactions
        fileIcon.fileObject = file;
        this.setupFilePreview(fileIcon, file);
        this.setupFileInteraction(fileIcon, file);
        
        return fileIcon;
    }

    setupFilePreview(fileIcon, file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                fileIcon.querySelector('img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    setupFileInteraction(fileIcon, file) {
        fileIcon.addEventListener('dblclick', () => {
            import('./file-handler.js').then(module => {
                const { FileHandler } = module;
                FileHandler.handleFileOpen({
                    name: file.name, 
                    type: this.getFileType(file),
                    fileObject: file
                });
            });
        });
    }

    getFileType(file) {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        const extension = fileName.split('.').pop();

        if (fileType.startsWith('image/')) return 'image';
        if (fileType.startsWith('audio/')) return 'audio';
        if (fileType.startsWith('video/')) return 'video';
        
        const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
        if (docExtensions.includes(extension)) return 'document';
        
        return 'file';
    }

    showUploadNotification(files) {
        const notificationSystem = new window.NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
            tag: 'Finder',
            title: 'Files Added',
            message: `${files.length} file${files.length !== 1 ? 's' : ''} uploaded successfully`,
            timeout: 3000
        });
    }
    
    getIconForFile(file) {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        const extension = fileName.split('.').pop();
        
        // Image files
        if (fileType.startsWith('image/')) {
            return 'https://macosicons.com/api/icons/Preview_macOS_Monterey/auto';
        }
        
        // Audio files
        if (fileType.startsWith('audio/')) {
            return 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/98838a6b1fcba311aa2826f8cb46d7c9_low_res_Music.png';
        }
        
        // Video files
        if (fileType.startsWith('video/')) {
            return 'https://macosicons.com/api/icons/QuickTime_Player_macOS_Big_Sur/auto';
        }
        
        // Document files
        switch (extension) {
            case 'pdf':
                return 'https://macosicons.com/api/icons/Adobe%20Acrobat_macOS_Big_Sur/auto';
            case 'doc':
            case 'docx':
                return 'https://macosicons.com/api/icons/Microsoft%20Word_macOS_Big_Sur/auto';
            case 'xls':
            case 'xlsx':
                return 'https://macosicons.com/api/icons/Microsoft%20Excel_macOS_Big_Sur/auto';
            case 'ppt':
            case 'pptx':
                return 'https://macosicons.com/api/icons/Microsoft%20PowerPoint_macOS_Big_Sur/auto';
            case 'txt':
                return 'https://macosicons.com/api/icons/TextEdit_macOS_Big_Sur/auto';
            case 'zip':
            case 'rar':
            case '7z':
                return 'https://macosicons.com/api/icons/Archive%20Utility_macOS_Big_Sur/auto';
            default:
                return 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/d7febe6b9ed1d06d935640ae57a3d93a_file.png';
        }
    }
}