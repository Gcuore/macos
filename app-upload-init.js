// New file: Initializes the drag‐and‐drop upload functionality for both the Music and Photos apps.
// This module periodically checks for Music and Photos app windows (created via window-creator.js)
// and, if found and not already initialized, calls the corresponding init functions.

import { initMusicAppUpload } from './music-app-upload.js';
import { initPhotosAppUpload } from './photos-app-upload.js';

document.addEventListener('DOMContentLoaded', () => {
  // Poll every 1 second to ensure the app windows are loaded.
  const intervalId = setInterval(() => {
    // Initialize Music app upload if a Music app window exists and hasn't been set up.
    const musicWindow = document.querySelector('.window[data-app="Music"]');
    if (musicWindow && !musicWindow.dataset.musicUploadInitialized && musicWindow.musicApp) {
      initMusicAppUpload(musicWindow.id);
      musicWindow.dataset.musicUploadInitialized = 'true';
    }
    
    // Initialize Photos app upload if a Photos app window exists and hasn't been set up.
    const photosWindow = document.querySelector('.window[data-app="Photos"]');
    if (photosWindow && !photosWindow.dataset.photosUploadInitialized && photosWindow.photosApp) {
      initPhotosAppUpload(photosWindow.id);
      photosWindow.dataset.photosUploadInitialized = 'true';
    }
    
    // If both apps have been initialized (or if neither exists), we can clear the interval.
    if ((musicWindow && musicWindow.dataset.musicUploadInitialized) &&
        (photosWindow && photosWindow.dataset.photosUploadInitialized)) {
      clearInterval(intervalId);
    }
  }, 1000);
});