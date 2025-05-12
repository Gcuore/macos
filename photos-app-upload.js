// New file: Handles drag‐and‐drop uploads for the Photos app.
// This module adds an overlay to the Photos app’s content area so that when the user drags image files over it,
 // a “Drop photo files here to import” message appears and, on drop, automatically calls the Photos app’s addPhoto() method.

export function initPhotosAppUpload(windowId) {
  const photosWindow = document.getElementById(windowId);
  if (!photosWindow) return;
  
  // Expect the Photos app instance to have been stored as "photosApp" on the window element.
  if (!photosWindow.photosApp) return;
  
  // Target the main photos content area – typically the container for the photos grid or the overall photos content.
  const photosContent = photosWindow.querySelector('.photos-content');
  if (!photosContent) return;
  photosContent.style.position = 'relative';
  
  // Create a drop overlay element.
  const overlay = document.createElement('div');
  overlay.className = 'photos-upload-overlay';
  overlay.textContent = 'Drop photo files here to import';
  Object.assign(overlay.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,122,255,0.2)',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: 'white',
    zIndex: '100'
  });
  photosContent.appendChild(overlay);

  // Show overlay when file is dragged over.
  photosContent.addEventListener('dragover', (e) => {
    e.preventDefault();
    overlay.style.display = 'flex';
  });

  // Hide overlay when dragging leaves.
  photosContent.addEventListener('dragleave', (e) => {
    e.preventDefault();
    overlay.style.display = 'none';
  });

  // Process the dropped file(s).
  photosContent.addEventListener('drop', (e) => {
    e.preventDefault();
    overlay.style.display = 'none';
    const files = Array.from(e.dataTransfer.files);
    // Process only image files.
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        photosWindow.photosApp.addPhoto(file);
      }
    });
  });
}