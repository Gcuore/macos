// New file to handle finder navigation
export class FinderNavigation {
    constructor() {
        this.currentSection = 'Favorites';
        this.history = ['Favorites'];
        this.historyIndex = 0;
        this.config = window.config;
    }

    navigateToSection(section) {
        if (section === this.currentSection) return;
        
        // If we're not at the end of the history, truncate the forward history
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.currentSection = section;
        this.history.push(section);
        this.historyIndex = this.history.length - 1;
        
        this.populateFinder(section);
        this.updateActiveSidebar();
        this.updateNavigationButtons();
    }

    updateActiveSidebar() {
        const sidebarItems = document.querySelectorAll('.finder-window .sidebar-item');
        sidebarItems.forEach(item => {
            const itemSection = item.querySelector('span').textContent;
            item.classList.toggle('active', itemSection === this.currentSection);
        });
    }

    updateNavigationButtons() {
        const backButton = document.querySelector('.finder-window .toolbar-icon.back');
        const forwardButton = document.querySelector('.finder-window .toolbar-icon.forward');
        
        if (backButton) {
            backButton.disabled = this.historyIndex <= 0;
            backButton.style.opacity = backButton.disabled ? '0.5' : '1';
        }
        
        if (forwardButton) {
            forwardButton.disabled = this.historyIndex >= this.history.length - 1;
            forwardButton.style.opacity = forwardButton.disabled ? '0.5' : '1';
        }
    }

    navigateBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentSection = this.history[this.historyIndex];
            this.populateFinder(this.currentSection);
            this.updateActiveSidebar();
            this.updateNavigationButtons();
        }
    }

    navigateForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentSection = this.history[this.historyIndex];
            this.populateFinder(this.currentSection);
            this.updateActiveSidebar();
            this.updateNavigationButtons();
        }
    }

    populateFinder(section) {
        try {
            const mainContent = document.querySelector('.finder-window .main-content');
            mainContent.innerHTML = ''; 

            let filesToDisplay = [];
            
            import('./file-handler.js').then(module => {
                const { FileHandler } = module;

                // Logic for different sections
                switch (section) {
                    case 'Recents':
                        filesToDisplay = this.config.finderFiles.slice(0, 5); // Show only 5 most recent files
                        break;
                    case 'Documents':
                        filesToDisplay = this.config.finderFiles.filter(file => file.type === 'file');
                        break;
                    case 'Downloads':
                        filesToDisplay = this.config.finderFiles.filter(file => 
                            ['zip', 'dmg', 'pkg', 'jpg', 'png', 'pdf'].some(ext => 
                                file.name.toLowerCase().endsWith(ext)
                            )
                        );
                        break;
                    case 'Home':
                        filesToDisplay = [
                            { name: "Documents", type: "folder" },
                            { name: "Pictures", type: "folder" },
                            { name: "Music", type: "folder" },
                            { name: "Desktop", type: "folder" }
                        ];
                        break;
                    case 'Pictures':
                        filesToDisplay = [
                            { name: "Vacation.jpg", type: "file" },
                            { name: "Screenshot.png", type: "file" }
                        ];
                        break;
                    case 'Music':
                        filesToDisplay = [
                            { name: "Playlist", type: "folder" },
                            { name: "Summer Hits.mp3", type: "file" }
                        ];
                        break;
                    default:
                        filesToDisplay = this.config.finderFiles;
                }

                filesToDisplay.forEach(file => {
                    const fileIcon = document.createElement('div');
                    fileIcon.classList.add('file-icon');
                    fileIcon.dataset.type = file.type;
                    fileIcon.dataset.name = file.name;
                    
                    // Get icon based on file type and extension
                    const iconUrl = FileHandler.getIconForFile(file.name, file.type);
                    
                    fileIcon.innerHTML = `
                        <img src="${iconUrl}" alt="${file.name}">
                        <div class="file-name">${file.name}</div>
                    `;
                    
                    // Add double-click handler
                    fileIcon.addEventListener('dblclick', () => {
                        FileHandler.handleFileOpen(file);
                    });
                    
                    // Add right-click context menu
                    fileIcon.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        if (window.contextMenuSystem) {
                            window.contextMenuSystem.showFileContextMenu(e, fileIcon);
                        }
                    });
                    
                    mainContent.appendChild(fileIcon);
                });
                
                // Update window title to reflect current location
                const title = document.querySelector('.finder-window .window-title');
                if (title) {
                    title.textContent = `Finder - ${section}`;
                }
            });
        } catch (error) {
            console.error("Error in populateFinder:", error);
        }
    }
}