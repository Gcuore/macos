// New file: Handles drag‐and‐drop uploads specifically for the Music app.
// This module adds an overlay to the Music app’s content area so that when the user drags audio files over it,
 // a “Drop music files here to import” UI appears and, on drop, automatically calls the music app’s addFile() method.

export function initMusicAppUpload(windowId) {
  const musicWindow = document.getElementById(windowId);
  if (!musicWindow) return;
  
  // Expect the Music app instance to have been stored in the window element as "musicApp"
  if (!musicWindow.musicApp) return;
  
  // Target the main music content area – ensure it is positioned relatively for overlay positioning.
  const musicContent = musicWindow.querySelector('.music-content');
  if (!musicContent) return;
  musicContent.style.position = 'relative';
  
  // Create a drop overlay element.
  const overlay = document.createElement('div');
  overlay.className = 'music-upload-overlay';
  overlay.textContent = 'Drop music files here to import';
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
  musicContent.appendChild(overlay);

  // Show overlay on dragover.
  musicContent.addEventListener('dragover', (e) => {
    e.preventDefault();
    overlay.style.display = 'flex';
  });

  // Hide overlay when dragging leaves.
  musicContent.addEventListener('dragleave', (e) => {
    e.preventDefault();
    overlay.style.display = 'none';
  });

  // Handle drop event.
  musicContent.addEventListener('drop', (e) => {
    e.preventDefault();
    overlay.style.display = 'none';
    const files = Array.from(e.dataTransfer.files);
    // Filter to only accept audio files.
    files.forEach(file => {
      if (file.type.startsWith('audio/')) {
        // Use the MusicApp instance method to add the track.
        musicWindow.musicApp.addFile(file);
      }
    });
  });
}