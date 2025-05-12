// Update file-handler.js to properly handle files with music and photos apps
export class FileHandler {
    static getIconForFile(fileName, fileType) {
        if (fileType === 'folder') {
            return '/IMG_0110.png';
        }
        
        const extension = fileName.split('.').pop().toLowerCase();
        
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
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'https://macosicons.com/api/icons/Preview_macOS_Big_Sur/auto';
            case 'mp3':
            case 'wav':
            case 'aac':
            case 'm4a':
                return 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/98838a6b1fcba311aa2826f8cb46d7c9_low_res_Music.png';
            case 'mp4':
            case 'mov':
                return 'https://macosicons.com/api/icons/QuickTime_Player_macOS_Big_Sur/auto';
            case 'zip':
            case 'rar':
                return 'https://macosicons.com/api/icons/Archive%20Utility_macOS_Big_Sur/auto';
            case 'txt':
                return 'https://macosicons.com/api/icons/TextEdit_macOS_Big_Sur/auto';
            default:
                return 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/d7febe6b9ed1d06d935640ae57a3d93a_file.png';
        }
    }

    static handleFileOpen(file) {
        if (!file || !file.name) {
            console.error('Invalid file object');
            return;
        }
        
        const fileType = this.getFileType(file);
        
        switch (fileType) {
            case 'image':
                this.openImageFile(file);
                break;
            case 'audio':
                this.openAudioFile(file);
                break;
            case 'video':
                this.openVideoFile(file);
                break;
            case 'document':
                this.openDocumentFile(file);
                break;
            default:
                this.showFileInfo(file.name);
        }
    }
    
    static getFileType(file) {
        // Properly determine file type based on extension and data
        let fileName, fileType;
        
        if (file.fileObject) {
            // If it's a wrapped file object from file uploader
            fileName = file.name;
            fileType = file.fileObject.type;
        } else if (file.type) {
            // If it has a type property directly
            fileName = file.name;
            fileType = file.type;
        } else {
            // Just use name
            fileName = file.name;
            fileType = '';
        }
        
        const extension = fileName.toLowerCase().split('.').pop();
        
        // Handle image files
        if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
            return 'image';
        }
        
        // Handle audio files
        if (fileType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(extension)) {
            return 'audio';
        }
        
        // Handle video files
        if (fileType.startsWith('video/') || ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
            return 'video';
        }
        
        // Handle document files
        const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
        if (docExtensions.includes(extension)) {
            return 'document';
        }
        
        // Default to generic file
        return 'file';
    }
    
    static openImageFile(file) {
        this.findOrCreateAppWindow('Photos', 'openPhotos', (windowElem) => {
            if (windowElem.photosApp) {
                // Use the app instance to add file
                const fileObj = file.fileObject || file;
                windowElem.photosApp.addFile(fileObj);
            } else {
                console.error('Photos app instance not found');
                this.fallbackMediaOpen(file, 'image');
            }
        });
    }
    
    static openAudioFile(file) {
        this.findOrCreateAppWindow('Music', 'openMusic', (windowElem) => {
            if (windowElem.musicApp) {
                // Use the app instance to add file
                const fileObj = file.fileObject || file;
                windowElem.musicApp.addFile(fileObj);
            } else {
                console.error('Music app instance not found');
                this.fallbackMediaOpen(file, 'audio');
            }
        });
    }
    
    static openVideoFile(file) {
        import('./window-creator.js').then(module => {
            const reader = new FileReader();
            reader.onload = (e) => {
                module.createMediaWindow('QuickTime', 'video', e.target.result, file.name);
            };
            reader.readAsDataURL(file.fileObject || file);
        });
    }
    
    static openDocumentFile(file) {
        import('./window-creator.js').then(module => {
            const reader = new FileReader();
            reader.onload = (e) => {
                let appName = 'TextEdit';
                const ext = file.name.split('.').pop().toLowerCase();
                
                if (ext === 'pdf') appName = 'Preview';

                const window = module.createCustomWindow(appName, `
                    <div class="document-viewer">
                        <div class="document-toolbar">
                            <button class="save-btn">Save</button>
                            <div class="file-name">${file.name}</div>
                        </div>
                        <div class="document-content">
                            ${ext === 'pdf' 
                                ? `<iframe src="${e.target.result}" style="width:100%; height:100%; border:none;"></iframe>`
                                : `<textarea style="width:100%; height:100%; padding:10px;">${e.target.result}</textarea>`
                            }
                        </div>
                    </div>
                `);
            };
            
            const fileObj = file.fileObject || file;
            if (fileObj.type === 'application/pdf') {
                reader.readAsDataURL(fileObj);
            } else {
                reader.readAsText(fileObj);
            }
        });
    }
    
    static showFileInfo(fileName) {
        const notificationSystem = new window.NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
            tag: 'Finder',
            title: 'File Info',
            message: `File: ${fileName}`,
            timeout: 3000
        });
    }
    
    static findOrCreateAppWindow(appName, action, callback) {
        // First look for existing app windows
        const existingWindows = Array.from(document.querySelectorAll(`.window[data-app="${appName}"]`))
            .filter(win => !win.classList.contains('minimized'));
        
        if (existingWindows.length > 0) {
            // Use the first existing window
            import('./window-manager.js').then(module => {
                module.bringToFront(existingWindows[0]);
                // Add timeout to ensure app is ready
                setTimeout(() => {
                    callback(existingWindows[0]);
                }, 300);
            });
        } else {
            // Create a new window
            import('./window-creator.js').then(module => {
                module.createAppWindow(appName, action).then(newWindow => {
                    // Give more time for the app to initialize
                    setTimeout(() => {
                        callback(newWindow);
                    }, 800);
                });
            });
        }
    }
    
    static fallbackMediaOpen(file, mediaType) {
        import('./window-creator.js').then(module => {
            const reader = new FileReader();
            reader.onload = (e) => {
                module.createMediaWindow(
                    mediaType === 'image' ? 'Photos' : 'Music', 
                    mediaType, 
                    e.target.result, 
                    file.name
                );
            };
            reader.readAsDataURL(file.fileObject || file);
        });
    }
}