// Update web-apps.js to handle full window coverage
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
            <div class="web-app ${appName.toLowerCase()}-app" style="height: 100%; display: flex; flex-direction: column;">
                <div class="web-app-content" style="flex: 1; position: relative;">
                    <iframe 
                        src="${config.url}"
                        sandbox="${config.sandbox}"
                        allow="geolocation; microphone; camera; midi; encrypted-media"
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                        frameborder="0">
                    </iframe>
                </div>
            </div>
        `;
    }
};