export async function initAppStore(windowId) {
    const content = `
        <div class="app-store">
            <div class="store-sidebar">
                <div class="store-nav">
                    <div class="nav-item active">
                        <svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/></svg>
                        Discover
                    </div>
                    <div class="nav-item">
                        <svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
                        Arcade
                    </div>
                    <div class="nav-item">
                        <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>
                        Create
                    </div>
                </div>
            </div>
            <div class="store-content">
                <div class="featured-section">
                    <h2>Featured Apps</h2>
                    <div class="featured-grid">
                        ${generateFeaturedApps()}
                    </div>
                </div>
                <div class="categories-section">
                    <h2>Categories</h2>
                    <div class="categories-grid">
                        ${generateCategories()}
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initAppStoreFunctionality(windowId);
    }, 0);

    return content;
}

function generateFeaturedApps() {
    const apps = [
        { name: 'PhotoEdit Pro', developer: 'Creative Apps Inc.', price: 'Free' },
        { name: 'Fitness Track', developer: 'Health Solutions', price: '$4.99' },
        { name: 'Meditation Guide', developer: 'Mindful Apps', price: 'Free' },
        { name: 'Weather Pro', developer: 'Weather Corp', price: '$2.99' }
    ];

    return apps.map(app => `
        <div class="featured-app">
            <div class="app-icon" style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4)"></div>
            <div class="app-info">
                <div class="app-name">${app.name}</div>
                <div class="app-developer">${app.developer}</div>
                <button class="get-button">${app.price}</button>
            </div>
        </div>
    `).join('');
}

function generateCategories() {
    const categories = [
        'Games', 'Productivity', 'Education', 'Lifestyle',
        'Social', 'Entertainment', 'Health & Fitness', 'Finance'
    ];

    return categories.map(category => `
        <div class="category-item">
            <div class="category-icon" style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4)"></div>
            <div class="category-name">${category}</div>
        </div>
    `).join('');
}

function initAppStoreFunctionality(windowId) {
    const appStore = document.querySelector(`#${windowId} .app-store`);
    const navItems = appStore.querySelectorAll('.nav-item');
    const getButtons = appStore.querySelectorAll('.get-button');
    const featuredApps = appStore.querySelectorAll('.featured-app');
    const categories = appStore.querySelectorAll('.category-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    getButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const app = e.target.closest('.featured-app');
            const appName = app.querySelector('.app-name').textContent;
            if (button.textContent === 'Free') {
                button.textContent = 'Get';
                setTimeout(() => {
                    button.textContent = 'Installing...';
                    setTimeout(() => {
                        button.textContent = 'Open';
                    }, 2000);
                }, 100);
            }
        });
    });

    featuredApps.forEach(app => {
        app.addEventListener('click', () => {
            openAppDetails(app, appStore);
        });
    });

    categories.forEach(category => {
        category.addEventListener('click', () => {
            // Would navigate to category view
            console.log('Opening category:', category.querySelector('.category-name').textContent);
        });
    });
}

function openAppDetails(app, container) {
    const appName = app.querySelector('.app-name').textContent;
    const developer = app.querySelector('.app-developer').textContent;
    
    const detailsView = document.createElement('div');
    detailsView.className = 'app-details';
    detailsView.innerHTML = `
        <div class="details-header">
            <button class="back-button">←</button>
            <div class="app-icon" style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4)"></div>
            <div class="details-info">
                <h2>${appName}</h2>
                <p>${developer}</p>
                <button class="get-button">${app.querySelector('.get-button').textContent}</button>
            </div>
        </div>
        <div class="details-content">
            <div class="screenshots">
                <img src="placeholder1.jpg" alt="Screenshot 1">
                <img src="placeholder2.jpg" alt="Screenshot 2">
            </div>
            <div class="description">
                <h3>About this app</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>
    `;

    detailsView.querySelector('.back-button').addEventListener('click', () => {
        detailsView.remove();
    });

    container.appendChild(detailsView);
}