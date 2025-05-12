// New file for enhanced music app functionality
import { MediaHandler } from './media-handler.js';
// NEW: Import the refactored listeners initializer.
import { initializeMusicAppListeners } from './music-app-listeners.js';

export class MusicApp {
    constructor(windowId) {
        this.windowId = windowId;
        this.tracks = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.audioElement = null;
        this.albumColors = {};
    }

    async initialize() {
        const content = `
            <div class="music-app">
                <div class="music-sidebar">
                    <div class="music-nav">
                        <div class="nav-item active" data-section="listen-now">
                            <svg viewBox="0 0 24 24"><path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8.56,12 7,13.56 7,15.5C7,17.44 8.56,19 10.5,19C12.44,19 14,17.44 14,15.5V6H18V3H12Z"/></svg>
                            Listen Now
                        </div>
                        <div class="nav-item" data-section="browse">
                            <svg viewBox="0 0 24 24"><path d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
                            Browse
                        </div>
                        <div class="nav-item" data-section="library">
                            <svg viewBox="0 0 24 24"><path d="M12,5.97L17.03,10.97L12,15.97L7,10.97L12,5.97M12,3L4,11L12,19L20,11L12,3Z"/></svg>
                            Library
                        </div>
                    </div>
                    <div class="music-sections">
                        <div class="music-section-header">Library</div>
                        <div class="music-section-item" data-section="songs">
                            <svg viewBox="0 0 24 24"><path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8.56,12 7,13.56 7,15.5C7,17.44 8.56,19 10.5,19C12.44,19 14,17.44 14,15.5V6H18V3H12Z"/></svg>
                            Songs
                        </div>
                        <div class="music-section-item" data-section="albums">
                            <svg viewBox="0 0 24 24"><path d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
                            Albums
                        </div>
                        <div class="music-section-item" data-section="artists">
                            <svg viewBox="0 0 24 24"><path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/></svg>
                            Artists
                        </div>
                        <div class="music-section-item" data-section="playlists">
                            <svg viewBox="0 0 24 24"><path d="M3,10H9V12H3V10M3,8H13V6H3V8M3,16H9V14H3V16M13,13V21H21V13H13M15,15H19V19H15V15M13,3H21V11H13V3M15,5V9H19V5H15Z"/></svg>
                            Playlists
                        </div>
                    </div>
                </div>
                <div class="music-content">
                    <div class="music-header">
                        <div class="search-bar">
                            <svg viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>
                            <input type="text" placeholder="Search">
                        </div>
                        <button class="upload-button">
                            <svg viewBox="0 0 24 24"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/></svg>
                            Upload Music
                        </button>
                    </div>
                    <div class="music-section active" id="listen-now-section">
                        <h2>Recently Added</h2>
                        <div class="music-grid">
                            <!-- Content will be dynamically populated -->
                        </div>
                    </div>
                    <div class="music-section" id="songs-section">
                        <div class="song-list-header">
                            <div class="song-number">#</div>
                            <div class="song-title">Title</div>
                            <div class="song-artist">Artist</div>
                            <div class="song-album">Album</div>
                            <div class="song-duration">Duration</div>
                        </div>
                        <div class="song-list">
                            <!-- Songs will be dynamically populated -->
                        </div>
                    </div>
                </div>
                <div class="music-player-bar">
                    <div class="now-playing">
                        <div class="track-art"></div>
                        <div class="track-info">
                            <div class="track-name">Not Playing</div>
                            <div class="track-artist">Select a song to play</div>
                        </div>
                    </div>
                    <div class="player-controls">
                        <button class="player-button shuffle">
                            <svg viewBox="0 0 24 24"><path d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z"/></svg>
                        </button>
                        <button class="player-button prev">
                            <svg viewBox="0 0 24 24"><path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z"/></svg>
                        </button>
                        <button class="player-button play-pause">
                            <svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
                        </button>
                        <button class="player-button next">
                            <svg viewBox="0 0 24 24"><path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z"/></svg>
                        </button>
                        <button class="player-button repeat">
                            <svg viewBox="0 0 24 24"><path d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z"/></svg>
                        </button>
                    </div>
                    <div class="volume-control">
                        <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M16,15H14V9H16M20,15H18V9H20V15Z"/></svg>
                        <input type="range" min="0" max="100" value="100">
                    </div>
                </div>
            </div>
        `;
        
        return content;
    }

    async init() {
        const content = await this.initialize();
        // Delay to allow content insertion
        setTimeout(() => {
            // NEW: Initialize event listeners using the new module.
            initializeMusicAppListeners(this);
            // Store a reference to the app instance in the window element for later use.
            const windowElem = document.getElementById(this.windowId);
            if (windowElem) {
                windowElem.musicApp = this;
            }
        }, 0);
        return content;
    }

    showSection(section) {
        const musicApp = document.querySelector(`#${this.windowId} .music-app`);
        const sections = musicApp.querySelectorAll('.music-section');
        
        sections.forEach(s => s.classList.remove('active'));
        
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            // Default to listen now if section doesn't exist
            document.getElementById('listen-now-section').classList.add('active');
        }
    }
    
    loadSampleTracks() {
        const sampleTracks = [
            { name: 'Summer Vibes', artist: 'The Groove', album: 'Summer Collection', duration: '3:45', color: '#FF6B6B' },
            { name: 'Midnight Dreams', artist: 'Luna', album: 'Night Sessions', duration: '4:20', color: '#4ECDC4' },
            { name: 'Electric Soul', artist: 'The Beat Makers', album: 'Electronic', duration: '3:55', color: '#1A535C' },
            { name: 'Sunset Drive', artist: 'Coastal Waves', album: 'Ocean Views', duration: '4:10', color: '#FF9F1C' }
        ];
        
        this.tracks = sampleTracks.map(track => ({
            ...track,
            src: '',
            file: null
        }));
        
        this.renderTracks();
        this.renderAlbumGrid();
    }
    
    renderTracks() {
        const musicApp = document.querySelector(`#${this.windowId} .music-app`);
        const songList = musicApp.querySelector('.song-list');
        
        if (!songList) return;
        
        songList.innerHTML = '';
        
        this.tracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'song-item';
            trackElement.dataset.index = index;
            
            trackElement.innerHTML = `
                <div class="song-number">${index + 1}</div>
                <div class="song-title">
                    <div class="song-art" style="background-color: ${track.color || this.getRandomColor()}"></div>
                    ${track.name}
                </div>
                <div class="song-artist">${track.artist}</div>
                <div class="song-album">${track.album || 'Unknown Album'}</div>
                <div class="song-duration">${track.duration}</div>
            `;
            
            trackElement.addEventListener('click', () => this.playTrack(index));
            
            songList.appendChild(trackElement);
        });
    }
    
    renderAlbumGrid() {
        const musicApp = document.querySelector(`#${this.windowId} .music-app`);
        const grid = musicApp.querySelector('.music-grid');
        
        if (!grid) return;
        
        // Group tracks by album
        const albums = {};
        this.tracks.forEach(track => {
            const album = track.album || 'Unknown Album';
            if (!albums[album]) {
                albums[album] = {
                    name: album,
                    artist: track.artist,
                    tracks: [],
                    color: track.color || this.getRandomColor()
                };
            }
            albums[album].tracks.push(track);
        });
        
        grid.innerHTML = '';
        
        Object.values(albums).forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.className = 'album-item';
            
            albumElement.innerHTML = `
                <div class="album-art" style="background-color: ${album.color}"></div>
                <div class="album-info">
                    <div class="album-name">${album.name}</div>
                    <div class="album-artist">${album.artist}</div>
                </div>
            `;
            
            albumElement.addEventListener('click', () => {
                // Play the first track of the album
                const trackIndex = this.tracks.findIndex(t => t.album === album.name);
                if (trackIndex !== -1) {
                    this.playTrack(trackIndex);
                }
            });
            
            grid.appendChild(albumElement);
        });
    }
    
    playTrack(index) {
        this.currentTrackIndex = index;
        const track = this.tracks[index];
        
        // Create new audio element if needed
        if (!this.audioElement) {
            this.audioElement = new Audio();
            this.setupAudioEvents();
        }
        
        // Update player UI
        this.updatePlayerDisplay(track);
        
        // Play the track
        if (track.src) {
            this.audioElement.src = track.src;
            this.audioElement.play()
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayPauseButton();
                })
                .catch(error => {
                    console.error('Error playing track:', error);
                });
        } else {
            // No source available
            this.isPlaying = false;
            this.updatePlayPauseButton();
        }
        
        // Update active track in list
        this.updateActiveTrack();
    }
    
    setupAudioEvents() {
        this.audioElement.addEventListener('ended', () => {
            this.playNext();
        });
        
        this.audioElement.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.isPlaying = false;
            this.updatePlayPauseButton();
        });
    }
    
    updatePlayerDisplay(track) {
        const musicApp = document.querySelector(`#${this.windowId} .music-app`);
        const trackArt = musicApp.querySelector('.track-art');
        const trackName = musicApp.querySelector('.track-name');
        const trackArtist = musicApp.querySelector('.track-artist');
        
        trackName.textContent = track.name;
        trackArtist.textContent = track.artist;
        
        const color = track.color || this.getRandomColor();
        trackArt.style.backgroundColor = color;
    }
    
    updatePlayPauseButton() {
        const musicApp = document.querySelector(`#${this.windowId} .music-app`);
        const playPauseBtn = musicApp.querySelector('.play-pause');
        
        if (this.isPlaying) {
            playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6,19H10V5H6V19M14,5V19H18V5H14Z"/></svg>';
        } else {
            playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>';
        }
    }
    
    updateActiveTrack() {
        const musicApp = document.querySelector(`#${this.windowId} .music-app`);
        const trackItems = musicApp.querySelectorAll('.song-item');
        
        trackItems.forEach(item => {
            const index = parseInt(item.dataset.index);
            item.classList.toggle('active', index === this.currentTrackIndex);
        });
    }
    
    togglePlayPause() {
        if (!this.audioElement || this.currentTrackIndex === -1) {
            // No track selected, play the first one
            if (this.tracks.length > 0) {
                this.playTrack(0);
            }
            return;
        }
        
        if (this.isPlaying) {
            this.audioElement.pause();
        } else {
            this.audioElement.play().catch(console.error);
        }
        
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
    }
    
    playNext() {
        if (this.tracks.length === 0) return;
        
        const nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.playTrack(nextIndex);
    }
    
    playPrevious() {
        if (this.tracks.length === 0) return;
        
        const prevIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.playTrack(prevIndex);
    }
    
    searchTracks(query) {
        const musicApp = document.querySelector(`#${this.windowId} .music-app`);
        const songItems = musicApp.querySelectorAll('.song-item');
        
        query = query.toLowerCase();
        
        songItems.forEach(item => {
            const index = parseInt(item.dataset.index);
            const track = this.tracks[index];
            
            const matchesQuery = 
                track.name.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query) ||
                (track.album && track.album.toLowerCase().includes(query));
            
            item.style.display = matchesQuery ? '' : 'none';
        });
    }
    
    openFileDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.multiple = true;
        
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                this.addTrack(file);
            });
        };
        
        input.click();
    }
    
    addTrack(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Extract metadata from filename
            const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            let artist = 'Unknown Artist';
            let name = fileName;
            
            // Try to parse artist - title format
            if (fileName.includes(' - ')) {
                const parts = fileName.split(' - ');
                artist = parts[0].trim();
                name = parts[1].trim();
            }
            
            const color = this.getRandomColor();
            
            const track = {
                name: name,
                artist: artist,
                album: 'Uploaded Music',
                duration: '0:00', // Will be updated when metadata is available
                color: color,
                src: e.target.result,
                file: file
            };
            
            this.tracks.unshift(track); // Add to the beginning of the array
            this.renderTracks();
            this.renderAlbumGrid();
            
            // Play the newly added track
            this.playTrack(0);
            
            // Show notification
            const notification = new window.NotificationSystem();
            notification.show({
                icon: 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/98838a6b1fcba311aa2826f8cb46d7c9_low_res_Music.png',
                tag: 'Music',
                title: 'Track Added',
                message: `Added "${track.name}" to your library`,
                timeout: 3000
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    // Utility method to get random color
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#1A535C', '#FF9F1C', '#F7B267', '#7A9E9F', '#B8F2E6', '#FFA69E'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Method to add a file directly (used by file-handler)
    addFile(file) {
        this.addTrack(file);
    }
}