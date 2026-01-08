/**
 * UIManager - Screen and HUD management
 */

import { getLevelConfig } from '../config/LevelConfig.js';

export class UIManager {
    constructor() {
        // Cache DOM elements
        this.elements = {
            startScreen: document.getElementById('startScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            hud: document.getElementById('hud'),
            scoreDisplay: document.getElementById('scoreDisplay'),
            levelDisplay: document.getElementById('levelDisplay'),
            levelNotif: document.getElementById('levelNotif'),
            levelTitle: document.getElementById('levelTitle'),
            finalScore: document.getElementById('finalScore'),
            bestScore: document.getElementById('bestScore'),
            retryBtn: document.getElementById('retryBtn')
        };

        this.onRetry = null;

        // Bind retry button
        if (this.elements.retryBtn) {
            this.elements.retryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.onRetry) this.onRetry();
            });
            this.elements.retryBtn.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                if (this.onRetry) this.onRetry();
            });
        }
    }

    /**
     * Set retry callback
     * @param {Function} callback
     */
    setRetryCallback(callback) {
        this.onRetry = callback;
    }

    /**
     * Show start screen
     */
    showStartScreen() {
        this.elements.startScreen?.classList.remove('hidden');
        this.elements.gameOverScreen?.classList.add('hidden');
        this.elements.hud?.classList.add('hidden');
    }

    /**
     * Show game playing UI
     */
    showPlayingUI() {
        this.elements.startScreen?.classList.add('hidden');
        this.elements.gameOverScreen?.classList.add('hidden');
        this.elements.hud?.classList.remove('hidden');
    }

    /**
     * Show game over screen
     * @param {number} score - Final score
     * @param {number} highScore - High score
     */
    showGameOver(score, highScore) {
        this.elements.hud?.classList.add('hidden');
        this.elements.gameOverScreen?.classList.remove('hidden');

        if (this.elements.finalScore) {
            this.elements.finalScore.innerText = score;
        }
        if (this.elements.bestScore) {
            this.elements.bestScore.innerText = highScore;
        }
    }

    /**
     * Update score display
     * @param {number} score - Current score
     */
    updateScore(score) {
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.innerText = score;
            this.elements.scoreDisplay.style.transform = "scale(1.3)";
            setTimeout(() => {
                this.elements.scoreDisplay.style.transform = "scale(1)";
            }, 150);
        }
    }

    /**
     * Update level display
     * @param {number} levelIdx - Current level index
     */
    updateLevel(levelIdx) {
        const config = getLevelConfig(levelIdx);

        if (this.elements.levelDisplay) {
            this.elements.levelDisplay.innerText = `${config.id} // ${config.name}`;
            this.elements.levelDisplay.style.color = config.color;
        }
    }

    /**
     * Show level transition notification
     * @param {number} levelIdx - New level index
     */
    showLevelNotification(levelIdx) {
        const config = getLevelConfig(levelIdx);

        if (this.elements.levelTitle) {
            this.elements.levelTitle.innerText = config.name;
            this.elements.levelTitle.style.color = config.color;
            this.elements.levelTitle.style.textShadow = `0 0 25px ${config.color}`;
        }

        if (this.elements.levelNotif) {
            this.elements.levelNotif.style.opacity = '1';
            this.elements.levelNotif.style.transform = 'scale(1.1)';

            setTimeout(() => {
                this.elements.levelNotif.style.opacity = '0';
                this.elements.levelNotif.style.transform = 'scale(1)';
            }, 2000);
        }
    }

    /**
     * Create screen flash effect
     */
    flashScreen() {
        const flash = document.createElement('div');
        Object.assign(flash.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            opacity: '0.3',
            transition: 'opacity 0.5s',
            pointerEvents: 'none',
            zIndex: '100'
        });
        document.body.appendChild(flash);

        requestAnimationFrame(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        });
    }
}
