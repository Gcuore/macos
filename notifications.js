// notifications.js
export class NotificationSystem {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'notification-center';
        document.body.appendChild(this.container);
    }

    show(options) {
        const notification = document.createElement('div');
        notification.className = 'macos-notification';
        
        notification.innerHTML = `
            <div class="notification-header">
                ${options.icon ? `<img src="${options.icon}" class="notification-icon" alt="">` : ''}
                ${options.tag ? `<span class="notification-tag">${options.tag}</span>` : ''}
                <span class="notification-title">${options.title}</span>
                <button class="notification-close">×</button>
            </div>
            <div class="notification-content">
                <p>${options.message}</p>
                ${options.actions ? this.createActions(options.actions) : ''}
            </div>
        `;

        // Add close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.dismiss(notification));

        this.container.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        if (options.timeout) {
            setTimeout(() => {
                this.dismiss(notification);
            }, options.timeout);
        }

        return notification;
    }

    createActions(actions) {
        return `
            <div class="notification-actions">
                ${actions.map(action => `
                    <button class="notification-action" onclick="${action.onClick}">
                        ${action.label}
                    </button>
                `).join('')}
            </div>
        `;
    }

    dismiss(notification) {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }

    showUnlockMessage() {
        // Only show if not dismissed before
        if (localStorage.getItem('hideUnlockPopup')) return null;
        
        return this.show({
            icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9b23bcaafd4c81fa40685736c9d2cac1_2DLff7nlvI.png',
            tag: 'System',
            title: 'Welcome to macOS',
            message: 'Write in the comments what I should add!',
            actions: [{
                label: "Don't show anymore",
                onClick: 'localStorage.setItem("hideUnlockPopup", "true"); this.closest(".macos-notification").remove()'
            }],
            timeout: 5000 // Auto dismiss after 5 seconds
        });
    }
}