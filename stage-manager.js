// Stage Manager functionality
let stageManagerActive = false;

export function initStageManager() {
    const stageManager = document.createElement('div');
    stageManager.className = 'stage-manager';
    stageManager.style.display = 'none';
    document.body.appendChild(stageManager);

    document.addEventListener('windowCreated', requestStageManagerUpdate);
    document.addEventListener('windowClosed', requestStageManagerUpdate);
    document.addEventListener('windowFocused', requestStageManagerUpdate);

    // real-time update on DOM change inside window content
    const observer = new MutationObserver(() => requestStageManagerUpdate());
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    document.addEventListener('mousedown', () => {
        requestStageManagerUpdate();
    });
    document.addEventListener('focusin', () => {
        requestStageManagerUpdate();
    });
}

let updateQueued = false;

function requestStageManagerUpdate() {
    if (!stageManagerActive || updateQueued) return;
    updateQueued = true;
    requestAnimationFrame(() => {
        updateStageManager();
        updateQueued = false;
    });
}

export function toggleStageManager() {
    stageManagerActive = !stageManagerActive;
    const stageManager = document.querySelector('.stage-manager');
    stageManager.style.display = stageManagerActive ? 'flex' : 'none';

    if (stageManagerActive) requestStageManagerUpdate();
}

function getAppIcon(appName) {
    const iconEntry = window.config?.dockIcons.find(i => i.name.toLowerCase() === appName.toLowerCase());
    if (iconEntry) return iconEntry.iconUrl;
    const dockIcon = document.querySelector(`.dock-icon[data-name="${appName}"] img`);
    if (dockIcon) return dockIcon.src;
    return 'https://macosicons.com/api/icons/Finder_macOS_Big_Sur/auto';
}

function getHighestZIndex() {
    return Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex || 1000)));
}

function bringToFront(winElem) {
    const maxZ = getHighestZIndex();
    winElem.style.zIndex = maxZ + 1;
    const event = new CustomEvent('windowFocused', { detail: { window: winElem } });
    document.dispatchEvent(event);
}

export function updateStageManager() {
    if (!stageManagerActive) return;

    const stageManager = document.querySelector('.stage-manager');
    const windows = Array.from(document.querySelectorAll('.window'))
        .filter(w => w.style.display !== 'none' && !w.classList.contains('minimized'));

    stageManager.innerHTML = ''; // clear previous previews

    for (const win of windows) {
        const appName = win.dataset.app || 'App';
        const appIcon = getAppIcon(appName);
        const isActive = parseInt(win.style.zIndex || 0) === getHighestZIndex();

        const preview = document.createElement('div');
        preview.className = `stage-preview ${isActive ? 'active' : ''}`;

        const previewContent = document.createElement('div');
        previewContent.className = 'preview-content';

        // Try to clone the live view of window-content
        const content = win.querySelector('.window-content');
        if (content) {
            const overlay = document.createElement('div');
            overlay.style.pointerEvents = 'none';
            overlay.style.userSelect = 'none';
            overlay.style.width = '400%';
            overlay.style.height = '400%';
            overlay.style.transform = 'scale(0.25)';
            overlay.style.transformOrigin = 'top left';

            // instead of cloning, append live content via a shadow clone
            const mirror = content.cloneNode(true);

            // remove problematic elements
            mirror.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const url = new URL(iframe.src);
                    if (url.hostname.includes('youtube.com')) {
                        const fallback = document.createElement('div');
                        fallback.style.width = '100%';
                        fallback.style.height = '100%';
                        fallback.style.display = 'flex';
                        fallback.style.alignItems = 'center';
                        fallback.style.justifyContent = 'center';
                        fallback.style.background = '#eee';
                        fallback.style.color = '#333';
                        fallback.textContent = 'YouTube';
                        iframe.replaceWith(fallback);
                    }
                } catch {
                    const fallback = document.createElement('div');
                    fallback.style.width = '100%';
                    fallback.style.height = '100%';
                    fallback.style.display = 'flex';
                    fallback.style.alignItems = 'center';
                    fallback.style.justifyContent = 'center';
                    fallback.style.background = '#eee';
                    fallback.style.color = '#333';
                    fallback.textContent = 'Web App';
                    iframe.replaceWith(fallback);
                }
            });

            overlay.appendChild(mirror);
            previewContent.appendChild(overlay);
        }

        const iconImg = document.createElement('img');
        iconImg.src = appIcon;
        iconImg.alt = appName;
        iconImg.className = 'preview-app-icon';

        preview.appendChild(previewContent);
        preview.appendChild(iconImg);

        preview.addEventListener('click', () => bringToFront(win));

        stageManager.appendChild(preview);
    }
}