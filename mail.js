export async function initMail(windowId) {
    const content = `
        <div class="mail-app">
            <div class="mail-sidebar">
                <div class="mail-folders">
                    <div class="folder active"><svg viewBox="0 0 24 24"><path d="M19,15H15A3,3 0 0,1 12,18A3,3 0 0,1 9,15H5V5H19M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/></svg>Inbox</div>
                    <div class="folder"><svg viewBox="0 0 24 24"><path d="M19,8L15,12H18A6,6 0 0,1 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20A8,8 0 0,0 20,12H23L19,8M6,12A6,6 0 0,1 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4A8,8 0 0,0 4,12H1L5,16L9,12H6Z"/></svg>Sent</div>
                    <div class="folder"><svg viewBox="0 0 24 24"><path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"/></svg>Trash</div>
                    <div class="folder"><svg viewBox="0 0 24 24"><path d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>Drafts</div>
                </div>
            </div>
            <div class="mail-list">
                <div class="mail-toolbar">
                    <button class="compose-btn">
                        <svg viewBox="0 0 24 24"><path d="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V8L12,13L20,8V18M20,6L12,11L4,6V6H20V6Z"/></svg>
                        Compose
                    </button>
                    <div class="mail-actions">
                        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4-4-4 1.41-1.41L11 13.67V10h2v3.67l1.59-1.59L16 13.5z"/></svg></button>
                        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"/></svg></button>
                        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></button>
                    </div>
                </div>
                <div class="mail-items">
                    <div class="mail-item unread">
                        <div class="sender">John Doe</div>
                        <div class="subject">Project Update</div>
                        <div class="preview">Hey, I wanted to share the latest updates...</div>
                        <div class="time">10:30 AM</div>
                    </div>
                    <div class="mail-item">
                        <div class="sender">Alice Smith</div>
                        <div class="subject">Meeting Tomorrow</div>
                        <div class="preview">Reminder about our scheduled meeting...</div>
                        <div class="time">Yesterday</div>
                    </div>
                </div>
            </div>
            <div class="mail-content">
                <div class="mail-header">
                    <h2>Project Update</h2>
                    <div class="mail-meta">
                        <span>From: John Doe &lt;john@example.com&gt;</span>
                        <span>To: Me</span>
                        <span>10:30 AM</span>
                    </div>
                </div>
                <div class="mail-body">
                    <p>Hey,</p>
                    <p>I wanted to share the latest updates on the project. We've made significant progress in the last week.</p>
                    <p>Best regards,<br>John</p>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initMailFunctionality(windowId);
    }, 0);

    return content;
}

function initMailFunctionality(windowId) {
    const mailApp = document.querySelector(`#${windowId} .mail-app`);
    const folders = mailApp.querySelectorAll('.folder');
    const mailItems = mailApp.querySelectorAll('.mail-item');
    const composeBtn = mailApp.querySelector('.compose-btn');

    folders.forEach(folder => {
        folder.addEventListener('click', () => {
            folders.forEach(f => f.classList.remove('active'));
            folder.classList.add('active');
            // Would update mail list based on selected folder
        });
    });

    mailItems.forEach(item => {
        item.addEventListener('click', () => {
            mailItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            item.classList.remove('unread');
            // Would load selected email content
        });
    });

    composeBtn.addEventListener('click', () => {
        const composer = document.createElement('div');
        composer.className = 'mail-composer';
        composer.innerHTML = `
            <div class="composer-header">
                <input type="text" placeholder="To">
                <input type="text" placeholder="Subject">
            </div>
            <textarea placeholder="Write your message..."></textarea>
            <div class="composer-actions">
                <button class="send-btn">Send</button>
                <button class="discard-btn">Discard</button>
            </div>
        `;
        mailApp.querySelector('.mail-content').appendChild(composer);
    });
}