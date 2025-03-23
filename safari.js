import { config } from './config.js';

export async function initSafari(windowId) {
    const content = `
        <div class="safari-browser">
            <div class="browser-toolbar">
                <div class="navigation-buttons">
                    <button class="nav-button back" disabled>
                        <svg viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/></svg>
                    </button>
                    <button class="nav-button forward" disabled>
                        <svg viewBox="0 0 24 24"><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/></svg>
                    </button>
                    <button class="nav-button reload">
                        <svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/></svg>
                    </button>
                </div>
                <div class="url-bar">
                    <input type="text" placeholder="Search or enter website URL">
                </div>
                <div class="browser-actions">
                    <button class="new-tab-button">+</button>
                </div>
            </div>
            <div class="tab-bar"></div>
            <div class="browser-viewport">
                <iframe src="about:blank" frameborder="0" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"></iframe>
            </div>
        </div>
    `;

    setTimeout(() => {
        initBrowserFunctionality(windowId);
    }, 0);

    return content;
}

function loadExternalUrl(url, iframe) {
    // Define web app URLs
    const webApps = {
        'music': 'https://gcuore.github.io/simplemusic',
        'maps': 'https://maps.google.com',
        'mail': 'https://mail.google.com', 
        'messages': 'https://web.whatsapp.com',
        'photos': 'https://photos.google.com',
        'appstore': 'https://apps.apple.com/it/story/id1457219438'
    };

    // Check if this is a web app URL
    const appUrl = webApps[url.toLowerCase()];
    const finalUrl = appUrl || url;

    // Add necessary protocols if missing
    if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
    }

    if (iframe) {
        // Update iframe sandbox attributes for web apps
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-presentation allow-orientation-lock');
        iframe.src = finalUrl;
    }
}

function initBrowserFunctionality(windowId) {
    const browser = document.querySelector(`#${windowId} .safari-browser`);
    const urlInput = browser.querySelector('.url-bar input');
    const iframe = browser.querySelector('iframe');
    const tabBar = browser.querySelector('.tab-bar');
    const backBtn = browser.querySelector('.nav-button.back');
    const forwardBtn = browser.querySelector('.nav-button.forward');
    const reloadBtn = browser.querySelector('.nav-button.reload');
    const newTabBtn = browser.querySelector('.new-tab-button');

    let tabs = [{ id: Date.now(), title: 'New Tab', url: 'about:blank', favicon: 'https://www.google.com/favicon.ico' }];
    let activeTabId = tabs[0].id;

    function createTabElement(tab) {
        const tabElement = document.createElement('div');
        tabElement.className = `browser-tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabElement.dataset.tabId = tab.id;
        tabElement.innerHTML = `
            <img src="${tab.favicon}" class="tab-favicon">
            <div class="tab-title">${tab.title}</div>
            <button class="close-tab">×</button>
        `;
        return tabElement;
    }

    function updateTabs() {
        tabBar.innerHTML = '';
        tabs.forEach(tab => {
            tabBar.appendChild(createTabElement(tab));
        });
    }

    function loadUrl(url) {
        if (!url.match(/^https?:\/\//)) {
            url = `https://${url}`;
        }
        
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (activeTab) {
            activeTab.url = url;
            loadExternalUrl(url, iframe);
            urlInput.value = url;
        }
    }

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadUrl(urlInput.value);
        }
    });

    newTabBtn.addEventListener('click', () => {
        const newTab = {
            id: Date.now(),
            title: 'New Tab',
            url: 'about:blank',
            favicon: 'https://www.google.com/favicon.ico'
        };
        tabs.push(newTab);
        activeTabId = newTab.id;
        updateTabs();
        urlInput.value = '';
        iframe.src = 'about:blank';
    });

    tabBar.addEventListener('click', (e) => {
        const tabElement = e.target.closest('.browser-tab');
        if (!tabElement) return;

        const tabId = parseInt(tabElement.dataset.tabId);
        
        if (e.target.classList.contains('close-tab')) {
            if (tabs.length > 1) {
                tabs = tabs.filter(t => t.id !== tabId);
                if (activeTabId === tabId) {
                    activeTabId = tabs[0].id;
                    const activeTab = tabs.find(t => t.id === activeTabId);
                    urlInput.value = activeTab.url;
                    iframe.src = activeTab.url;
                }
                updateTabs();
            }
        } else {
            activeTabId = tabId;
            const activeTab = tabs.find(t => t.id === activeTabId);
            urlInput.value = activeTab.url;
            iframe.src = activeTab.url;
            updateTabs();
        }
    });

    reloadBtn.addEventListener('click', () => {
        iframe.src = iframe.src;
    });

    // Handle iframe navigation events
    iframe.addEventListener('load', () => {
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (activeTab) {
            activeTab.url = iframe.src;
            activeTab.title = iframe.contentDocument?.title || 'New Tab';
            urlInput.value = iframe.src;
            updateTabs();
        }
    });

    updateTabs();
}