// lockscreen.js

let isLocked = true;

export function initLockScreen() {
    const lockScreenOverlay = document.querySelector('.lock-screen-overlay');
    lockScreenOverlay.style.display = 'flex'; // Ensure lockscreen is visible on launch

    // When clicking on the overlay (outside the central content) unlock the screen
    lockScreenOverlay.addEventListener('click', unlockScreen);
    // Prevent clicks inside the lockscreen content from triggering an unlock
    const content = lockScreenOverlay.querySelector('.lock-screen-content');
    if (content) {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    updateLockScreenTime();
    setInterval(updateLockScreenTime, 1000); // Update time every second
}

export function toggleLockScreen() {
    isLocked = !isLocked;
    const lockScreenOverlay = document.querySelector('.lock-screen-overlay');
    lockScreenOverlay.style.display = isLocked ? 'flex' : 'none';
    if (isLocked) {
        // Optionally pause other interactions when locked if needed in future
    } else {
        // Optionally resume interactions
    }
}

function unlockScreen() {
    if (isLocked) {
        toggleLockScreen(); // Simple unlock for now
    }
}

function updateLockScreenTime() {
    if (isLocked) {
        const now = new Date();
        const timeSpan = document.querySelector('.lock-screen-time');
        const dateSpan = document.querySelector('.lock-screen-date');

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format

        const time = `${hours}:${minutes} ${ampm}`;

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const day = now.getDate();
        const year = now.getFullYear();
        const date = `${dayName}, ${monthName} ${day}, ${year}`;

        if (timeSpan) timeSpan.textContent = time;
        if (dateSpan) dateSpan.textContent = date;
    }
}