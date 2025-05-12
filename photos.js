import { PhotosApp } from './photos-app.js';

export async function initPhotos(windowId) {
    const photosApp = new PhotosApp(windowId);
    const content = await photosApp.initialize();
    
    setTimeout(() => {
        photosApp.setupListeners();
        
        // Store a reference to the app instance in the window element for later use
        const windowElem = document.getElementById(windowId);
        if (windowElem) {
            windowElem.photosApp = photosApp;
        }
    }, 0);

    return content;
}