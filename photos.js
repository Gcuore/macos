export async function initPhotos(windowId) {
    const content = `
        <div class="photos-app">
            <div class="photos-sidebar">
                <div class="photos-nav">
                    <div class="nav-item active">
                        <svg viewBox="0 0 24 24"><path d="M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z"/></svg>
                        All Photos
                    </div>
                    <div class="nav-item">
                        <svg viewBox="0 0 24 24"><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"/></svg>
                        Memories
                    </div>
                    <div class="nav-item">
                        <svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
                        Favorites
                    </div>
                </div>
            </div>
            <div class="photos-content">
                <div class="photos-toolbar">
                    <button class="import-btn">Import</button>
                    <div class="view-options">
                        <button class="grid-view active">
                            <svg viewBox="0 0 24 24"><path d="M3,3H11V11H3V3M13,3H21V11H13V3M3,13H11V21H3V13M13,13H21V21H13V13Z"/></svg>
                        </button>
                        <button class="list-view">
                            <svg viewBox="0 0 24 24"><path d="M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z"/></svg>
                        </button>
                    </div>
                </div>
                <div class="photos-grid">
                    ${generateSamplePhotos()}
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initPhotosFunctionality(windowId);
    }, 0);

    return content;
}

function generateSamplePhotos() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
    return Array.from({ length: 20 }, (_, i) => {
        const color = colors[i % colors.length];
        return `
            <div class="photo-item" style="background-color: ${color}">
                <div class="photo-overlay">
                    <button class="favorite-btn">♥</button>
                    <div class="photo-date">May ${i + 1}, 2023</div>
                </div>
            </div>
        `;
    }).join('');
}

function initPhotosFunctionality(windowId) {
    const photosApp = document.querySelector(`#${windowId} .photos-app`);
    const navItems = photosApp.querySelectorAll('.nav-item');
    const viewButtons = photosApp.querySelectorAll('.view-options button');
    const photoItems = photosApp.querySelectorAll('.photo-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            const isGrid = button.classList.contains('grid-view');
            photosApp.querySelector('.photos-grid').classList.toggle('list-layout', !isGrid);
        });
    });

    photoItems.forEach(item => {
        const favBtn = item.querySelector('.favorite-btn');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            favBtn.classList.toggle('active');
        });

        item.addEventListener('click', () => {
            openPhotoViewer(item, photosApp);
        });
    });
}

function openPhotoViewer(photoItem, container) {
    const viewer = document.createElement('div');
    viewer.className = 'photo-viewer';
    viewer.innerHTML = `
        <div class="viewer-toolbar">
            <button class="close-viewer">×</button>
            <button class="edit-photo">Edit</button>
            <button class="share-photo">Share</button>
        </div>
        <div class="viewer-content">
            <div class="photo-view" style="background-color: ${photoItem.style.backgroundColor}"></div>
        </div>
    `;

    viewer.querySelector('.close-viewer').addEventListener('click', () => {
        viewer.remove();
    });

    container.appendChild(viewer);
}

