// New file for finder functionality
export function initFinderActions() {
    // Back/Forward navigation
    const backBtn = document.querySelector('.finder-window .toolbar-icon.back');
    const forwardBtn = document.querySelector('.finder-window .toolbar-icon.forward');
    let history = [];
    let currentIndex = -1;

    backBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            navigateToPath(history[currentIndex]);
            updateNavigationButtons();
        }
    });

    forwardBtn.addEventListener('click', () => {
        if (currentIndex < history.length - 1) {
            currentIndex++;
            navigateToPath(history[currentIndex]);
            updateNavigationButtons();
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.finder-window .search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterFiles(searchTerm);
    });

    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.finder-window .sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const path = item.querySelector('span').textContent;
            navigateToPath(path);
            addToHistory(path);
        });
    });

    function filterFiles(searchTerm) {
        const files = document.querySelectorAll('.finder-window .file-icon');
        files.forEach(file => {
            const fileName = file.querySelector('.file-name').textContent.toLowerCase();
            file.style.display = fileName.includes(searchTerm) ? 'flex' : 'none';
        });
    }

    function navigateToPath(path) {
        // Update active sidebar item
        sidebarItems.forEach(item => {
            const itemPath = item.querySelector('span').textContent;
            item.classList.toggle('active', itemPath === path);
        });

        // Simulate loading content for the path
        populateFinderContent(path);
    }

    function addToHistory(path) {
        currentIndex++;
        history = history.slice(0, currentIndex);
        history.push(path);
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        backBtn.disabled = currentIndex <= 0;
        forwardBtn.disabled = currentIndex >= history.length - 1;
        
        // Update button styles
        backBtn.style.opacity = backBtn.disabled ? '0.5' : '1';
        forwardBtn.style.opacity = forwardBtn.disabled ? '0.5' : '1';
    }

    function populateFinderContent(path) {
        const mainContent = document.querySelector('.finder-window .main-content');
        const { config } = window;
        
        // Clear existing content
        mainContent.innerHTML = '';
        
        // Filter files based on current path
        let filesToShow = [];
        switch(path) {
            case 'Recents':
                filesToShow = config.finderFiles.slice(-5); // Show last 5 files
                break;
            case 'Home':
                filesToShow = config.finderFiles.filter(f => f.type === 'folder');
                break;
            case 'Documents':
                filesToShow = config.finderFiles.filter(f => f.type === 'file');
                break;
            case 'Downloads':
                filesToShow = config.finderFiles.filter(f => 
                    ['zip', 'dmg', 'pkg'].some(ext => f.name.toLowerCase().endsWith(ext))
                );
                break;
            default:
                filesToShow = config.finderFiles;
        }

        // Populate files
        filesToShow.forEach(file => {
            const fileIcon = document.createElement('div');
            fileIcon.className = 'file-icon';
            fileIcon.innerHTML = `
                <img src="${file.iconUrl}" alt="${file.name}">
                <div class="file-name">${file.name}</div>
            `;
            mainContent.appendChild(fileIcon);
        });
    }
}