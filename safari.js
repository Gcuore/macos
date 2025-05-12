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
            <div class="browser-viewport"></div>
        </div>
    `;

    setTimeout(() => {
        initBrowserFunctionality(windowId);
    }, 0);

    return content;
}

function initBrowserFunctionality(windowId) {
    const browser = document.querySelector(`#${windowId} .safari-browser`);
    const urlInput = browser.querySelector('.url-bar input');
    const tabBar = browser.querySelector('.tab-bar');
    const viewport = browser.querySelector('.browser-viewport');
    const backBtn = browser.querySelector('.nav-button.back');
    const forwardBtn = browser.querySelector('.nav-button.forward');
    const reloadBtn = browser.querySelector('.nav-button.reload');
    const newTabBtn = browser.querySelector('.new-tab-button');

    let tabs = [];
    let activeTabId = null;

    function createTab() {
        const tabId = Date.now();
        const tab = {
            id: tabId,
            title: 'New Tab',
            url: 'about:blank',
            favicon: 'https://www.google.com/favicon.ico',
            iframe: document.createElement('iframe')
        };
        
        tab.iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-downloads');
        tab.iframe.style.width = '100%';
        tab.iframe.style.height = '100%';
        tab.iframe.style.border = 'none';
        tab.iframe.style.display = 'none';
        
        viewport.appendChild(tab.iframe);
        
        tabs.push(tab);
        return tab;
    }

    function createTabElement(tab) {
        const tabElement = document.createElement('div');
        tabElement.className = `browser-tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabElement.dataset.tabId = tab.id;
        tabElement.innerHTML = `
            <img src="${tab.favicon}" class="tab-favicon" alt="favicon">
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
        
        // Show active tab's iframe, hide others
        tabs.forEach(tab => {
            tab.iframe.style.display = tab.id === activeTabId ? 'block' : 'none';
        });
    }

    function setActiveTab(tabId) {
        activeTabId = tabId;
        const activeTab = tabs.find(t => t.id === tabId);
        if (activeTab) {
            urlInput.value = activeTab.url !== 'about:blank' ? activeTab.url : '';
            updateTabs();
        }
    }

    function loadUrl(url, tabId) {
        const tab = tabs.find(t => t.id === tabId);
        if (!tab) return;

        if (!url.match(/^https?:\/\//)) {
            url = `https://${url}`;
        }

        tab.url = url;
        tab.iframe.src = url;
        urlInput.value = url;

        // Setup iframe load event listener
        tab.iframe.onload = () => {
            try {
                tab.title = tab.iframe.contentDocument?.title || url;
                // Try to get favicon from the loaded page
                const favicon = tab.iframe.contentDocument?.querySelector('link[rel*="icon"]')?.href;
                if (favicon) {
                    tab.favicon = favicon;
                }
            } catch (e) {
                tab.title = new URL(url).hostname;
            }
            updateTabs();
        };
    }

    // Create initial tab
    const initialTab = createTab();
    setActiveTab(initialTab.id);
    updateTabs();

    // Event Listeners
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && urlInput.value.trim()) {
            loadUrl(urlInput.value.trim(), activeTabId);
        }
    });

    newTabBtn.addEventListener('click', () => {
        const newTab = createTab();
        setActiveTab(newTab.id);
        updateTabs();
    });

    tabBar.addEventListener('click', (e) => {
        const tabElement = e.target.closest('.browser-tab');
        if (!tabElement) return;

        const tabId = parseInt(tabElement.dataset.tabId);
        
        if (e.target.classList.contains('close-tab')) {
            if (tabs.length > 1) {
                // Remove tab and its iframe
                const tabIndex = tabs.findIndex(t => t.id === tabId);
                const tab = tabs[tabIndex];
                tab.iframe.remove();
                tabs = tabs.filter(t => t.id !== tabId);
                
                // If closing active tab, activate the next or previous tab
                if (activeTabId === tabId) {
                    const newActiveTab = tabs[tabIndex] || tabs[tabIndex - 1];
                    setActiveTab(newActiveTab.id);
                }
                updateTabs();
            }
        } else {
            setActiveTab(tabId);
        }
    });

    reloadBtn.addEventListener('click', () => {
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (activeTab && activeTab.url !== 'about:blank') {
            loadUrl(activeTab.url, activeTabId);
        }
    });
}