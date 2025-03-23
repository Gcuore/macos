export async function initMessages(windowId) {
    const content = `
        <div class="messages-app">
            <div class="messages-sidebar">
                <div class="messages-search">
                    <input type="text" placeholder="Search messages">
                </div>
                <div class="conversations-list">
                    <div class="conversation active">
                        <img src="https://ui-avatars.com/api/?name=John+Doe" alt="John Doe">
                        <div class="conversation-preview">
                            <div class="conversation-name">John Doe</div>
                            <div class="conversation-last">Hey, how are you?</div>
                        </div>
                    </div>
                    <div class="conversation">
                        <img src="https://ui-avatars.com/api/?name=Alice+Smith" alt="Alice Smith">
                        <div class="conversation-preview">
                            <div class="conversation-name">Alice Smith</div>
                            <div class="conversation-last">See you tomorrow!</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="messages-content">
                <div class="messages-header">
                    <img src="https://ui-avatars.com/api/?name=John+Doe" alt="John Doe">
                    <span>John Doe</span>
                </div>
                <div class="messages-chat">
                    <div class="message received">
                        <div class="message-content">Hey, how are you?</div>
                        <div class="message-time">10:30 AM</div>
                    </div>
                    <div class="message sent">
                        <div class="message-content">I'm good, thanks! How about you?</div>
                        <div class="message-time">10:31 AM</div>
                    </div>
                </div>
                <div class="messages-input">
                    <input type="text" placeholder="iMessage">
                    <button class="send-button">
                        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initMessagesFunctionality(windowId);
    }, 0);

    return content;
}

function initMessagesFunctionality(windowId) {
    const messagesApp = document.querySelector(`#${windowId} .messages-app`);
    const conversations = messagesApp.querySelectorAll('.conversation');
    const messageInput = messagesApp.querySelector('.messages-input input');
    const sendButton = messagesApp.querySelector('.send-button');
    const chatContainer = messagesApp.querySelector('.messages-chat');

    conversations.forEach(conv => {
        conv.addEventListener('click', () => {
            conversations.forEach(c => c.classList.remove('active'));
            conv.classList.add('active');
            // Would load conversation history
        });
    });

    function sendMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</div>
        `;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    sendButton.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text) {
            sendMessage(text);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && messageInput.value.trim()) {
            sendMessage(messageInput.value.trim());
            messageInput.value = '';
        }
    });
}

