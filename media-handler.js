export class MediaHandler {
    static initAudioPlayer(container, audioUrl, fileName) {
        const playerId = `audio-${Date.now()}`;
        container.innerHTML = `
            <div class="music-player">
                <div class="track-info">
                    <div class="album-art" style="background: linear-gradient(45deg, ${this.getRandomColor()}, ${this.getRandomColor()})"></div>
                    <div class="track-details">
                        <div class="track-name">${fileName}</div>
                        <div class="artist-name">Local File</div>
                    </div>
                </div>
                <div class="playback-controls">
                    <button class="prev-track">
                        <svg viewBox="0 0 24 24"><path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z"/></svg>
                    </button>
                    <button class="play-pause" data-player="${playerId}">
                        <svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
                    </button>
                    <button class="next-track">
                        <svg viewBox="0 0 24 24"><path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z"/></svg>
                    </button>
                </div>
                <audio id="${playerId}" src="${audioUrl}"></audio>
            </div>
        `;

        const audio = container.querySelector(`#${playerId}`);
        const playButton = container.querySelector('.play-pause');
        const prevButton = container.querySelector('.prev-track');
        const nextButton = container.querySelector('.next-track');

        audio.play();
        playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6,19H10V5H6V19M14,5V19H18V5H14Z"/></svg>';

        playButton.onclick = () => {
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6,19H10V5H6V19M14,5V19H18V5H14Z"/></svg>';
            } else {
                audio.pause();
                playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>';
            }
        };

        // Placeholder for next/prev functions
        prevButton.onclick = () => {};
        nextButton.onclick = () => {};
    }

    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

