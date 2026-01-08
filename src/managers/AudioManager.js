/**
 * AudioManager - Background music and audio control
 */

export class AudioManager {
    constructor() {
        this.bgm = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg');
        this.bgm.loop = true;
        this.bgm.volume = 0.4;

        this.isMuted = false;
        this.hasInteracted = false;

        this.toggleBtn = document.getElementById('audioToggle');
        if (this.toggleBtn) {
            this.toggleBtn.classList.add('paused');
            this.toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }
    }

    /**
     * Toggle audio playback
     * @param {boolean} forcePlay - Force play audio
     */
    toggle(forcePlay = false) {
        if (forcePlay && !this.isMuted) {
            this.bgm.play().catch(e => console.log("Audio waiting for interaction"));
            if (this.toggleBtn) {
                this.toggleBtn.classList.remove('paused');
            }
            return;
        }

        if (this.bgm.paused) {
            this.bgm.play().catch(e => console.log("Audio blocked"));
            if (this.toggleBtn) {
                this.toggleBtn.classList.remove('paused');
            }
            this.isMuted = false;
        } else {
            this.bgm.pause();
            if (this.toggleBtn) {
                this.toggleBtn.classList.add('paused');
            }
            this.isMuted = true;
        }
    }

    /**
     * Handle first user interaction for audio playback
     */
    handleFirstInteraction() {
        if (!this.hasInteracted) {
            this.hasInteracted = true;
            this.toggle(true);
        }
    }

    /**
     * Set volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        this.bgm.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Check if audio is playing
     * @returns {boolean}
     */
    isPlaying() {
        return !this.bgm.paused;
    }
}
