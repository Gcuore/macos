// launchpad.js
import { config } from './config.js';

export function initLaunchpad() {
    try {
        const launchpad = document.querySelector('.launchpad-overlay');
        launchpad.style.display = 'none'; // Ensure launchpad is hidden on startup

        // Add click handler to close when clicking background
        launchpad.addEventListener('click', (e) => {
            // Only close if clicking directly on the launchpad overlay (not its children)
            if (e.target === launchpad) {
                toggleLaunchpad();
            }
        });

        config.launchpadIcons.forEach(icon => {
            const launchpadIcon = document.createElement('div');
            launchpadIcon.classList.add('launchpad-icon');
            launchpadIcon.innerHTML = `
                <img src="${icon.iconUrl}" alt="${icon.name}">
                <div class="launchpad-icon-name">${icon.name}</div>
            `;
            launchpadIcon.addEventListener('click', () => {
                handleAppAction(icon.action, icon.name);
                toggleLaunchpad(); // Close launchpad after app is selected
            });
            launchpad.appendChild(launchpadIcon);
        });
    } catch (error) {
        console.error("Error in initLaunchpad:", error);
    }
}

export function toggleLaunchpad() {
    const launchpad = document.querySelector('.launchpad-overlay');
    launchpad.style.display = launchpad.style.display === 'none' ? 'grid' : 'none';
}