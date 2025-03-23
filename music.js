export async function initMusic(windowId) {
    const content = `
        <div class="music-app">
            <div class="music-sidebar">
                <div class="music-nav">
                    <div class="nav-item active">
                        <svg viewBox="0 0 24 24"><path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8.56,12 7,13.56 7,15.5C7,17.44 8.56,19 10.5,19C12.44,19 14,17.44 14,15.5V6H18V3H12Z"/></svg>
                        Listen Now
                    </div>
                    <div class="nav-item">
                        <svg viewBox="0 0 24 24"><path d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
                        Browse
                    </div>
                    <div class="nav-item">
                        <svg viewBox="0 0 24 24"><path d="M12,5.97L17.03,10.97L12,15.97L7,10.97L12,5.97M12,3L4,11L12,19L20,11L12,3Z"/></svg>
                        Library
                    </div>
                </div>
                <div class="playlists">
                    <h3>Playlists</h3>
                    <div class="playlist-item">Recently Added</div>
                    <div class="playlist-item">Recently Played</div>
                    <div class="playlist-item">Top Songs</div>
                </div>
            </div>
            <div class="music-content">
                <div class="now-playing">
                    <div class="track-info">
                        <div class="album-art"></div>
                        <div class="track-details">
                            <div class="track-name">Track Name</div>
                            <div class="artist-name">Artist Name</div>
                        </div>
                    </div>
                    <div class="playback-controls">
                        <button class="prev-track">
                            <svg viewBox="0 0 24 24"><path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z"/></svg>
                        </button>
                        <button class="play-pause">
                            <svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
                        </button>
                        <button class="next-track">
                            <svg viewBox="0 0 24 24"><path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z"/></svg>
                        </button>
                    </div>
                    <div class="volume-control">
                        <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M16,15H14V9H16V15Z"/></svg>
                        <input type="range" min="0" max="100" value="50">
                    </div>
                </div>
                <div class="music-library">
                    ${generateSampleTracks()}
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initMusicFunctionality(windowId);
    }, 0);

    return content;
}

function generateSampleTracks() {
    const tracks = [
        { name: 'Summer Vibes', artist: 'The Groove', duration: '3:45' },
        { name: 'Midnight Dreams', artist: 'Luna', duration: '4:20' },
        { name: 'Electric Soul', artist: 'The Beat Makers', duration: '3:55' },
        { name: 'Sunset Drive', artist: 'Coastal Waves', duration: '4:10' }
    ];

    return tracks.map(track => `
        <div class="track-item">
            <div class="track-item-info">
                <div class="track-name">${track.name}</div>
                <div class="artist-name">${track.artist}</div>
            </div>
            <div class="track-duration">${track.duration}</div>
        </div>
    `).join('');
}

function initMusicFunctionality(windowId) {
    const musicApp = document.querySelector(`#${windowId} .music-app`);
    const playPauseBtn = musicApp.querySelector('.play-pause');
    const volumeSlider = musicApp.querySelector('.volume-control input');
    const trackItems = musicApp.querySelectorAll('.track-item');
    const navItems = musicApp.querySelectorAll('.nav-item');

    let isPlaying = false;

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.innerHTML = isPlaying ? 
            '<svg viewBox="0 0 24 24"><path d="M6,19H10V5H6V19M14,5V19H18V5H14Z"/></svg>' :
            '<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>';
    });

    volumeSlider.addEventListener('input', (e) => {
        // Would handle volume change
        console.log('Volume:', e.target.value);
    });

    trackItems.forEach(item => {
        item.addEventListener('click', () => {
            trackItems.forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            // Would start playing the selected track
        });
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}