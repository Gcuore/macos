// New file for enhanced photos app functionality
export class PhotosApp {
    constructor(windowId) {
        this.windowId = windowId;
        this.photos = [];
        this.currentPhotoIndex = -1;
        this.viewMode = 'grid'; // grid or single
    }

    async initialize() {
        const content = `
            <div class="photos-app">
                <div class="photos-sidebar">
                    <div class="photos-nav">
                        <div class="nav-item active" data-section="library">
                            <svg viewBox="0 0 24 24"><path d="M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z"/></svg>
                            Library
                        </div>
                        <div class="nav-item" data-section="albums">
                            <svg viewBox="0 0 24 24"><path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"/></svg>
                            Albums
                        </div>
                        <div class="nav-item" data-section="favorites">
                            <svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
                            Favorites
                        </div>
                    </div>
                    <div class="photos-collections">
                        <div class="section-header">Collections</div>
                        <div class="collection-item active">All Photos</div>
                        <div class="collection-item">Recents</div>
                        <div class="collection-item">Screenshots</div>
                        <div class="collection-item">Selfies</div>
                    </div>
                </div>
                <div class="photos-content">
                    <div class="photos-header">
                        <div class="search-bar">
                            <svg viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>
                            <input type="text" placeholder="Search">
                        </div>
                        <div class="photos-view-controls">
                            <button class="view-button grid active">
                                <svg viewBox="0 0 24 24"><path d="M3,3H11V11H3V3M13,3H21V11H13V3M3,13H11V21H3V13M13,13H21V21H13V13Z"/></svg>
                            </button>
                            <button class="view-button list">
                                <svg viewBox="0 0 24 24"><path d="M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z"/></svg>
                            </button>
                        </div>
                        <button class="upload-button">
                            <svg viewBox="0 0 24 24"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/></svg>
                            Import Photos
                        </button>
                    </div>
                    <div class="photos-section active" id="library-section">
                        <div class="photos-grid-view">
                            <!-- Photos will be populated here -->
                        </div>
                        <div class="photos-single-view">
                            <button class="back-to-grid">
                                <svg viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/></svg>
                                Back to Library
                            </button>
                            <div class="photo-viewer">
                                <div class="photo-container">
                                    <!-- Current photo will be displayed here -->
                                </div>
                                <div class="photo-controls">
                                    <button class="prev-photo">
                                        <svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>
                                    </button>
                                    <button class="next-photo">
                                        <svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
                                    </button>
                                </div>
                                <div class="photo-info">
                                    <div class="photo-name">Photo Name</div>
                                    <div class="photo-date">Date</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return content;
    }

    setupListeners() {
        const photosApp = document.querySelector(`#${this.windowId} .photos-app`);
        
        // Navigation
        const navItems = photosApp.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.showSection(item.dataset.section);
            });
        });
        
        // Collection items
        const collectionItems = photosApp.querySelectorAll('.collection-item');
        collectionItems.forEach(item => {
            item.addEventListener('click', () => {
                collectionItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.filterByCollection(item.textContent);
            });
        });
        
        // View controls
        const viewButtons = photosApp.querySelectorAll('.view-button');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                if (button.classList.contains('grid')) {
                    this.setViewMode('grid');
                } else {
                    this.setViewMode('list');
                }
            });
        });
        
        // Back to grid button
        const backButton = photosApp.querySelector('.back-to-grid');
        backButton.addEventListener('click', () => {
            this.setViewMode('grid');
        });
        
        // Photo navigation
        const prevButton = photosApp.querySelector('.prev-photo');
        const nextButton = photosApp.querySelector('.next-photo');
        
        prevButton.addEventListener('click', () => this.showPreviousPhoto());
        nextButton.addEventListener('click', () => this.showNextPhoto());
        
        // Upload button
        const uploadButton = photosApp.querySelector('.upload-button');
        uploadButton.addEventListener('click', () => this.openFileDialog());
        
        // Search functionality
        const searchInput = photosApp.querySelector('.search-bar input');
        searchInput.addEventListener('input', (e) => this.searchPhotos(e.target.value));
        
        // Generate sample photos
        this.generateSamplePhotos();
    }
    
    showSection(section) {
        const photosApp = document.querySelector(`#${this.windowId} .photos-app`);
        const sections = photosApp.querySelectorAll('.photos-section');
        
        sections.forEach(s => s.classList.remove('active'));
        
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            // Default to library if section doesn't exist
            document.getElementById('library-section').classList.add('active');
        }
    }
    
    generateSamplePhotos() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
        
        for (let i = 0; i < 20; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            this.photos.push({
                id: `sample-${i}`,
                name: `Sample Photo ${i + 1}`,
                date: date.toDateString(),
                color: colors[i % colors.length],
                source: null,
                file: null,
                favorite: Math.random() > 0.8,
                collection: Math.random() > 0.5 ? 'Recents' : 'Screenshots'
            });
        }
        
        this.renderPhotos();
    }
    
    renderPhotos() {
        const photosApp = document.querySelector(`#${this.windowId} .photos-app`);
        const gridView = photosApp.querySelector('.photos-grid-view');
        
        gridView.innerHTML = '';
        
        this.photos.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.dataset.index = index;
            
            let photoContent;
            if (photo.source) {
                photoContent = `<img src="${photo.source}" alt="${photo.name}">`;
            } else {
                photoContent = `<div class="photo-placeholder" style="background-color: ${photo.color}"></div>`;
            }
            
            photoElement.innerHTML = `
                ${photoContent}
                <div class="photo-overlay">
                    <button class="favorite-btn ${photo.favorite ? 'active' : ''}">♥</button>
                    <div class="photo-date">${photo.date}</div>
                </div>
            `;
            
            photoElement.addEventListener('click', () => {
                this.viewPhoto(index);
            });
            
            const favoriteBtn = photoElement.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(index);
                favoriteBtn.classList.toggle('active');
            });
            
            gridView.appendChild(photoElement);
        });
    }
    
    viewPhoto(index) {
        this.currentPhotoIndex = index;
        const photo = this.photos[index];
        
        const photosApp = document.querySelector(`#${this.windowId} .photos-app`);
        const photoContainer = photosApp.querySelector('.photo-container');
        const photoName = photosApp.querySelector('.photo-info .photo-name');
        const photoDate = photosApp.querySelector('.photo-info .photo-date');
        
        let photoContent;
        if (photo.source) {
            photoContent = `<img src="${photo.source}" alt="${photo.name}">`;
        } else {
            photoContent = `<div class="photo-placeholder large" style="background-color: ${photo.color}"></div>`;
        }
        
        photoContainer.innerHTML = photoContent;
        photoName.textContent = photo.name;
        photoDate.textContent = photo.date;
        
        this.setViewMode('single');
    }
    
    setViewMode(mode) {
        this.viewMode = mode;
        
        const photosApp = document.querySelector(`#${this.windowId} .photos-app`);
        const gridView = photosApp.querySelector('.photos-grid-view');
        const singleView = photosApp.querySelector('.photos-single-view');
        
        if (mode === 'grid') {
            gridView.style.display = 'grid';
            singleView.style.display = 'none';
        } else {
            gridView.style.display = 'none';
            singleView.style.display = 'flex';
        }
        
        // Update view button states
        const gridButton = photosApp.querySelector('.view-button.grid');
        const listButton = photosApp.querySelector('.view-button.list');
        
        if (mode === 'grid') {
            gridButton.classList.add('active');
            listButton.classList.remove('active');
            gridView.classList.remove('list-layout');
        } else if (mode === 'list') {
            gridButton.classList.remove('active');
            listButton.classList.add('active');
            gridView.classList.add('list-layout');
        }
    }
    
    showNextPhoto() {
        if (this.photos.length === 0) return;
        
        const nextIndex = (this.currentPhotoIndex + 1) % this.photos.length;
        this.viewPhoto(nextIndex);
    }
    
    showPreviousPhoto() {
        if (this.photos.length === 0) return;
        
        const prevIndex = (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length;
        this.viewPhoto(prevIndex);
    }
    
    toggleFavorite(index) {
        this.photos[index].favorite = !this.photos[index].favorite;
    }
    
    filterByCollection(collection) {
        const photosApp = document.querySelector(`#${this.windowId} .photos-app`);
        const photoItems = photosApp.querySelectorAll('.photo-item');
        
        if (collection === 'All Photos') {
            photoItems.forEach(item => {
                item.style.display = '';
            });
            return;
        }
        
        if (collection === 'Favorites') {
            photoItems.forEach(item => {
                const index = parseInt(item.dataset.index);
                const photo = this.photos[index];
                item.style.display = photo.favorite ? '' : 'none';
            });
            return;
        }
        
        photoItems.forEach(item => {
            const index = parseInt(item.dataset.index);
            const photo = this.photos[index];
            item.style.display = photo.collection === collection ? '' : 'none';
        });
    }
    
    searchPhotos(query) {
        const photosApp = document.querySelector(`#${this.windowId} .photos-app`);
        const photoItems = photosApp.querySelectorAll('.photo-item');
        
        query = query.toLowerCase();
        
        photoItems.forEach(item => {
            const index = parseInt(item.dataset.index);
            const photo = this.photos[index];
            
            const matchesQuery = 
                photo.name.toLowerCase().includes(query) ||
                photo.date.toLowerCase().includes(query);
            
            item.style.display = matchesQuery ? '' : 'none';
        });
    }
    
    openFileDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                this.addPhoto(file);
            });
        };
        
        input.click();
    }
    
    addPhoto(file) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const date = new Date().toDateString();
                
                const photo = {
                    id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    name: file.name,
                    date: date,
                    color: null,
                    source: e.target.result,
                    file: file,
                    favorite: false,
                    collection: 'Recents'
                };
                
                this.photos.unshift(photo); // Add to the beginning of the array
                this.renderPhotos();
                
                // View the newly added photo
                this.viewPhoto(0);
                
                // Show notification if available
                if (window.NotificationSystem) {
                    const notification = new window.NotificationSystem();
                    notification.show({
                        icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c0b761fc19488f0b4d2311f29b71ba01_low_res_Photos.png',
                        tag: 'Photos',
                        title: 'Photo Added',
                        message: `Added "${photo.name}" to your library`,
                        timeout: 3000
                    });
                }
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error adding photo:", error);
        }
    }
    
    // Method to add a file directly (used by file-handler)
    addFile(file) {
        this.addPhoto(file);
    }
}