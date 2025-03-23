import { config } from './config.js';

export function initDock() {
    try {
        const dock = document.querySelector('.dock');
        dock.style.display = 'flex'; // Ensure horizontal layout
        
        config.dockIcons.forEach(icon => {
            const dockIcon = document.createElement('div');
            dockIcon.classList.add('dock-icon');
            dockIcon.innerHTML = `
                <img src="${icon.iconUrl}" alt="${icon.name}">
                <div class="dock-icon-dot"></div>
                <div class="dock-tooltip">${icon.name}</div>
            `;
            dockIcon.setAttribute('data-name', icon.name);

            dockIcon.addEventListener('mouseenter', () => {
                dockIcon.classList.add('hovered');
            });

            dockIcon.addEventListener('mouseleave', () => {
                dockIcon.classList.remove('hovered');
            });

            dockIcon.addEventListener('click', () => {
                window.handleAppAction(icon.action, icon.name);
            });

            dock.appendChild(dockIcon);
        });

        setupDockMagnification();
    } catch (error) {
        console.error("Error in initDock:", error);
    }
}

function setupDockMagnification() {
    const dock = document.querySelector('.dock');
    let isOverDock = false;

    dock.addEventListener('mouseenter', () => {
        isOverDock = true;
        dock.style.transition = 'all 0.15s cubic-bezier(0.2, 0, 0, 1)';
    });

    dock.addEventListener('mouseleave', () => {
        isOverDock = false;
        resetDockIconTransforms();
        dock.style.transition = 'all 0.2s cubic-bezier(0.2, 0, 0, 1)';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isOverDock) return;
        
        const dockRect = dock.getBoundingClientRect();
        const dockIcons = Array.from(document.querySelectorAll('.dock-icon'));
        
        dockIcons.forEach((icon) => {
            const iconRect = icon.getBoundingClientRect();
            const iconCenterX = iconRect.left + iconRect.width / 2;
            const distance = Math.abs(e.clientX - iconCenterX);
            const maxDistance = 150; // Restored to original maxDistance
            
            if (distance < maxDistance) {
                const scale = 1 + (config.dockMaxZoom - 1) * Math.cos((distance / maxDistance) * Math.PI / 2);
                const lift = (scale - 1) * config.dockSize * config.dockLiftMultiplier;
                icon.style.transform = `scale(${scale}) translateY(${-lift}px)`;
                icon.style.zIndex = Math.round(scale * 100);
                icon.style.transition = 'transform 0.08s cubic-bezier(0.2, 0, 0, 1)'; // Faster transition
            } else {
                icon.style.transform = 'scale(1) translateY(0)';
                icon.style.zIndex = 1;
                icon.style.transition = 'transform 0.08s cubic-bezier(0.2, 0, 0, 1)'; // Faster transition
            }
        });
    });
}

function resetDockIconTransforms() {
    const dockIcons = document.querySelectorAll('.dock-icon');
    dockIcons.forEach((icon) => {
        icon.style.transform = 'scale(1) translateY(0px)';
        icon.style.zIndex = 'auto';
        icon.style.transition = 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'; // Slightly longer for reset
    });
}