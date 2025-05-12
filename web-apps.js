// web-apps.js

export const WebApps = {
    initializeWebApp(appName, windowId) {
        const appConfigs = {
            music: {
                url: 'https://gcuore.github.io/simplemusic',
                sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups'
            },
            maps: {
                url: 'https://maps.google.com',
                sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-geolocation'
            },
            mail: {
                url: 'https://mail.google.com',
                sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads'
            },
            messages: {
                url: 'https://web.whatsapp.com',
                sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-camera allow-microphone'
            },
            photos: {
                url: 'https://photos.google.com',
                sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads'
            },
            appstore: {
                url: 'https://apps.apple.com/it/story/id1457219438',
                sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups'
            }
        };

        const config = appConfigs[appName.toLowerCase()];
        if (!config) return null;

        return `
            <div class="web-app">
                <div class="web-app-content">
                    <iframe 
                        src="${config.url}"
                        sandbox="${config.sandbox}"
                        allow="geolocation; microphone; camera; midi; encrypted-media">
                    </iframe>
                </div>
            </div>
        `;
    }
};