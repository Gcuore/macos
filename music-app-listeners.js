// New file: music-app-listeners.js
// This module refactors and replaces the old setupListeners method from music-app.js,
// fixing the issue where songs would fail to load (error "undefined") by properly capturing
// the music app instance. All references to "window.musicApp" have been replaced with the
// passed instance "musicAppInstance".

import { MediaHandler } from './media-handler.js';

export function initializeMusicAppListeners(musicAppInstance) {
  // Get the music app container inside the window using its windowId.
  const musicWindowElem = document.querySelector(`#${musicAppInstance.windowId} .music-app`);
  if (!musicWindowElem) {
    console.error("Music app element not found with ID", musicAppInstance.windowId);
    return;
  }
  
  const playPauseBtn = musicWindowElem.querySelector('.play-pause');
  const volumeSlider = musicWindowElem.querySelector('.volume-control input');
  const trackItems = musicWindowElem.querySelectorAll('.song-item');
  const navItems = musicWindowElem.querySelectorAll('.nav-item');
  const playlistItems = musicWindowElem.querySelectorAll('.music-section-item');
  const trackArt = musicWindowElem.querySelector('.track-art');
  const trackNameElem = musicWindowElem.querySelector('.track-name');
  const trackArtistElem = musicWindowElem.querySelector('.track-artist');

  let currentTrackIndex = 0;
  let isPlaying = false;
  let audioElement = null;

  function setupAudioElement(trackSource) {
    if (audioElement) {
      audioElement.pause();
    }
    audioElement = new Audio(trackSource);
    setupAudioControls();
  }

  function setupAudioControls() {
    if (!audioElement) return;
    audioElement.addEventListener('ended', () => {
      nextTrack();
    });
    volumeSlider.addEventListener('input', () => {
      if (audioElement) {
        audioElement.volume = volumeSlider.value / 100;
      }
    });
  }

  function updateTrackDisplay(track) {
    trackNameElem.textContent = track.name;
    trackArtistElem.textContent = track.artist;
    trackArt.style.background = `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})`;
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function playTrack(index) {
    currentTrackIndex = index;
    if (!musicAppInstance.tracks || !musicAppInstance.tracks[index]) {
      console.error("Track not found at index", index, "in tracks array:", musicAppInstance.tracks);
      return;
    }
    const track = musicAppInstance.tracks[index];
    // Check if this is an uploaded file (has a file property)
    if (track.file) {
      // Use MediaHandler to open the file in the music app view.
      MediaHandler.initAudioPlayer(
        musicWindowElem.querySelector('.music-content'),
        track.src,
        track.name
      );
    } else {
      // For sample tracks, load and play the track from its source.
      setupAudioElement(track.src);
      updateTrackDisplay(track);
      if (audioElement) {
        audioElement.play();
        isPlaying = true;
        playPauseBtn.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M6,19H10V5H6V19M14,5V19H18V5H14Z"/></svg>';
      }
    }
    // Update visual active state on track list
    trackItems.forEach(item => item.classList.remove('active'));
    if (trackItems[index]) {
      trackItems[index].classList.add('active');
    }
  }

  function nextTrack() {
    if (musicAppInstance.tracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % musicAppInstance.tracks.length;
    playTrack(currentTrackIndex);
  }

  function previousTrack() {
    if (musicAppInstance.tracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + musicAppInstance.tracks.length) % musicAppInstance.tracks.length;
    playTrack(currentTrackIndex);
  }

  playPauseBtn.addEventListener('click', () => {
    if (audioElement) {
      if (audioElement.paused) {
        audioElement.play();
        isPlaying = true;
        playPauseBtn.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M6,19H10V5H6V19M14,5V19H18V5H14Z"/></svg>';
      } else {
        audioElement.pause();
        isPlaying = false;
        playPauseBtn.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>';
      }
    }
  });

  trackItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      playTrack(index);
    });
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      playlistItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  const nextBtn = musicWindowElem.querySelector('.next');
  const prevBtn = musicWindowElem.querySelector('.prev');
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (prevBtn) prevBtn.addEventListener('click', previousTrack);
}