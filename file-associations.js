export class FileAssociations {
    static openFile(fileName, iconElement, fileObject) {
        if (!fileObject) return;

        const extension = fileName.split('.').pop().toLowerCase();
        const fileType = this.getFileType(fileObject);

        switch (fileType) {
            case 'image':
                this.openImageFile(fileObject);
                break;
            case 'audio':
                this.openAudioFile(fileObject);
                break;
            case 'video':
                this.openVideoFile(fileObject);
                break;
            case 'document':
                this.openDocumentFile(fileObject);
                break;
            default:
                this.showFileInfo(fileName);
        }
    }

    static getFileType(fileObject) {
        const fileType = fileObject.type;
        if (fileType.startsWith('image/')) return 'image';
        if (fileType.startsWith('audio/')) return 'audio';
        if (fileType.startsWith('video/')) return 'video';
        
        const fileName = fileObject.name.toLowerCase();
        const extension = fileName.split('.').pop();
        const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
        
        return docExtensions.includes(extension) ? 'document' : 'file';
    }

    static openImageFile(fileObject) {
        import('./window-creator.js').then(module => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const window = module.createMediaWindow('Photos', 'image', e.target.result, fileObject.name);
                
                // Set up specific image viewer behavior
                const previewContent = window.querySelector('.preview-content');
                const img = previewContent.querySelector('img');
                
                img.addEventListener('click', () => {
                    img.classList.toggle('zoomed');
                });
            };
            reader.readAsDataURL(fileObject);
        });
    }

    static openAudioFile(fileObject) {
        import('./window-creator.js').then(module => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const window = module.createMediaWindow('Music', 'audio', e.target.result, fileObject.name);
                
                // Additional music player controls
                const playButton = window.querySelector('.play-pause');
                const audioElement = window.querySelector('audio');
                
                playButton.addEventListener('click', () => {
                    if (audioElement.paused) {
                        audioElement.play();
                        playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6,19H10V5H6V19M14,5V19H18V5H14Z"/></svg>';
                    } else {
                        audioElement.pause();
                        playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>';
                    }
                });
            };
            reader.readAsDataURL(fileObject);
        });
    }

    static openVideoFile(fileObject) {
        import('./window-creator.js').then(module => {
            const reader = new FileReader();
            reader.onload = (e) => {
                module.createMediaWindow('QuickTime', 'video', e.target.result, fileObject.name);
            };
            reader.readAsDataURL(fileObject);
        });
    }

    static openDocumentFile(fileObject) {
        import('./window-creator.js').then(module => {
            const reader = new FileReader();
            reader.onload = (e) => {
                let appName = 'TextEdit';
                const ext = fileObject.name.split('.').pop().toLowerCase();
                
                if (ext === 'pdf') appName = 'Preview';

                const window = module.createCustomWindow(appName, `
                    <div class="document-viewer">
                        <div class="document-toolbar">
                            <button class="save-btn">Save</button>
                            <div class="file-name">${fileObject.name}</div>
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
            
            if (fileObject.type === 'application/pdf') {
                reader.readAsDataURL(fileObject);
            } else {
                reader.readAsText(fileObject);
            }
        });
    }

    static showFileInfo(fileName) {
        const notificationSystem = new window.NotificationSystem();
        notificationSystem.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png',
            tag: 'Finder',
            title: 'File Info',
            message: `Unable to open file: ${fileName}`,
            timeout: 3000
        });
    }
}