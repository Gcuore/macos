// window-manager.js - Streamlined window management
export function initWindowManager(winElem) {
    if (!winElem) return;

    const state = {
        isDragging: false,
        isMaximized: false,
        originalState: null,
        dragOffset: { x: 0, y: 0 }
    };

    initializeWindowControls(winElem, state);
    setupDragging(winElem, state);
    setupResizing(winElem);
}

function initializeWindowControls(winElem, state) {
    const closeBtn = winElem.querySelector('.window-button.close');
    const minBtn = winElem.querySelector('.window-button.minimize');
    const maxBtn = winElem.querySelector('.window-button.maximize');
    
    closeBtn?.addEventListener('click', () => closeWindow(winElem));
    minBtn?.addEventListener('click', () => minimizeWindow(winElem));
    maxBtn?.addEventListener('click', () => toggleMaximize(winElem, state));
    
    winElem.addEventListener('mousedown', () => bringToFront(winElem));
}

function closeWindow(winElem) {
    winElem.style.animation = 'windowClose 0.2s ease-out';
    winElem.addEventListener('animationend', () => {
        winElem.remove();
        updateDockIcon(winElem);
        
        // Dispatch event for Stage Manager
        const event = new CustomEvent('windowClosed', { detail: { window: winElem } });
        document.dispatchEvent(event);
    });
}

function minimizeWindow(winElem) {
    // If the window contains a web-app element, minimize it without the clone animation
    // This prevents the web app from "splitting" and only showing half its content.
    if (winElem.querySelector('.web-app')) {
        winElem.style.display = 'none';
        winElem.classList.add('minimized');
        updateDockIcon(winElem, true);
        return;
    }

    const dockIcon = getDockIcon(winElem);
    if (!dockIcon) {
        winElem.style.display = 'none';
        winElem.classList.add('minimized');
        return;
    }

    const winRect = winElem.getBoundingClientRect();
    const iconRect = dockIcon.getBoundingClientRect();
    
    winElem.style.transformOrigin = 'center';
    winElem.style.animation = 'windowMinimize 0.3s ease-in forwards';
    
    setTimeout(() => {
        winElem.style.display = 'none';
        winElem.classList.add('minimized');
        updateDockIcon(winElem, true);
    }, 300);
}

function toggleMaximize(winElem, state) {
    const dockHeight = 70; // Height of the dock
    const menuBarHeight = 30; // Height of the menu bar
    const padding = 10; // Padding from dock

    if (!state.isMaximized) {
        state.originalState = {
            width: winElem.style.width,
            height: winElem.style.height,
            left: winElem.style.left,
            top: winElem.style.top
        };

        // Calculate available space considering dock and menu bar
        const availableHeight = window.innerHeight - menuBarHeight - dockHeight - padding;

        winElem.style.transition = 'all 0.3s ease';
        winElem.style.left = '0';
        winElem.style.top = menuBarHeight + 'px';
        winElem.style.width = '100%';
        winElem.style.height = availableHeight + 'px';
        state.isMaximized = true;
    } else {
        Object.assign(winElem.style, state.originalState);
        state.isMaximized = false;
    }

    // Ensure window stays above other windows
    bringToFront(winElem);
}

function setupDragging(winElem, state) {
    const header = winElem.querySelector('.window-header');
    if (!header) return;

    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-button')) return;
        
        state.isDragging = true;
        state.dragOffset = {
            x: e.clientX - winElem.offsetLeft,
            y: e.clientY - winElem.offsetTop
        };
        
        winElem.style.transition = 'none';
        header.style.cursor = 'grabbing';
        bringToFront(winElem);
    });

    document.addEventListener('mousemove', (e) => {
        if (!state.isDragging) return;

        const newLeft = e.clientX - state.dragOffset.x;
        const newTop = e.clientY - state.dragOffset.y;

        winElem.style.left = `${Math.max(0, Math.min(window.innerWidth - winElem.offsetWidth, newLeft))}px`;
        winElem.style.top = `${Math.max(0, Math.min(window.innerHeight - winElem.offsetHeight, newTop))}px`;
    });

    document.addEventListener('mouseup', () => {
        if (!state.isDragging) return;
        
        state.isDragging = false;
        header.style.cursor = 'grab';
        winElem.style.transition = '';
    });
}

function setupResizing(winElem) {
    const handles = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'].map(dir => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${dir}`;
        handle.dataset.direction = dir;
        return handle;
    });

    handles.forEach(handle => winElem.appendChild(handle));
}

export function bringToFront(winElem) {
    const windows = document.querySelectorAll('.window');
    const maxZ = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 1000)));
    winElem.style.zIndex = maxZ + 1;
    
    // Dispatch event for Stage Manager
    const event = new CustomEvent('windowFocused', { detail: { window: winElem } });
    document.dispatchEvent(event);
}

function getDockIcon(winElem) {
    const appName = winElem.dataset.app;
    return document.querySelector(`.dock-icon[data-name="${appName}"]`);
}

function updateDockIcon(winElem, isMinimized = false) {
    const dockIcon = getDockIcon(winElem);
    if (dockIcon) {
        const dot = dockIcon.querySelector('.dock-icon-dot');
        if (dot) {
            dot.style.opacity = isMinimized ? '0.5' : '0';
        }
    }
}

export function restoreWindow(winElem) {
    if (!winElem) return;
    winElem.style.display = 'block';
    winElem.classList.remove('minimized');
    winElem.style.animation = 'windowRestore 0.3s ease-out forwards';
    updateDockIcon(winElem, false);
}