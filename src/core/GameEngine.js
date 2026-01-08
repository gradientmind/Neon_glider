/**
 * GameEngine - Core game loop and state management
 */

import { Canvas } from './Canvas.js';
import { EventBus, Events } from './EventBus.js';
import { Player } from '../entities/Player.js';
import { ObstacleManager } from '../entities/Obstacle.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { BackgroundSystem } from '../systems/BackgroundSystem.js';
import { AudioManager } from '../managers/AudioManager.js';
import { InputManager } from '../managers/InputManager.js';
import { UIManager } from '../managers/UIManager.js';
import { ScoreManager } from '../managers/ScoreManager.js';
import { getLevelForScore, getLevelConfig } from '../config/LevelConfig.js';

// Game States
export const STATE = {
    START: 0,
    PLAYING: 1,
    GAMEOVER: 2
};

export class GameEngine {
    constructor(canvasId) {
        // Core systems
        this.canvas = new Canvas(canvasId);
        this.ctx = this.canvas.ctx;

        // Managers
        this.audioManager = new AudioManager();
        this.inputManager = new InputManager();
        this.uiManager = new UIManager();
        this.scoreManager = new ScoreManager();

        // Systems
        this.particleSystem = new ParticleSystem();
        this.backgroundSystem = new BackgroundSystem(this.canvas);

        // Entities
        this.player = new Player(this.canvas);
        this.obstacles = new ObstacleManager(this.canvas);

        // State
        this.currentState = STATE.START;
        this.currentLevelIdx = 0;
        this.animationFrameId = null;
        this.lastTime = 0;

        // Setup callbacks
        this._setupCallbacks();
        this._setupEventListeners();

        // Initial render
        this._renderStartScreen();
    }

    /**
     * Setup input and UI callbacks
     * @private
     */
    _setupCallbacks() {
        // Input handling
        this.inputManager.setActionCallback((e) => {
            if (this.currentState === STATE.START) {
                this.start();
            } else if (this.currentState === STATE.PLAYING) {
                this.player.jump();
            }
        });

        // Retry button
        this.uiManager.setRetryCallback(() => {
            this.start();
        });
    }

    /**
     * Setup event bus listeners
     * @private
     */
    _setupEventListeners() {
        // Player jump particles
        EventBus.on(Events.PLAYER_JUMP, (data) => {
            this.particleSystem.createJumpBurst(data.x, data.y, data.color);
        });

        // Player collision
        EventBus.on(Events.PLAYER_COLLIDE, (data) => {
            this.gameOver();
        });

        // Score update
        EventBus.on(Events.SCORE_UPDATE, (data) => {
            this.scoreManager.addPoints(data.increment);
            this.uiManager.updateScore(this.scoreManager.getScore());
            this._checkLevelProgression();
        });
    }

    /**
     * Check and handle level progression
     * @private
     */
    _checkLevelProgression() {
        const newLevel = getLevelForScore(this.scoreManager.getScore());

        if (newLevel !== this.currentLevelIdx) {
            this.currentLevelIdx = newLevel;

            // Update all systems with new level
            this.player.setLevel(newLevel);
            this.obstacles.setLevel(newLevel);
            this.backgroundSystem.setLevel(newLevel);

            // UI feedback
            this.uiManager.updateLevel(newLevel);
            this.uiManager.showLevelNotification(newLevel);
            this.uiManager.flashScreen();
        }
    }

    /**
     * Render initial start screen
     * @private
     */
    _renderStartScreen() {
        this.backgroundSystem.draw(this.ctx);
        this.player.x = this.canvas.width * 0.15;
        this.player.y = this.canvas.height / 2;
        this.player.draw(this.ctx);
    }

    /**
     * Start or restart the game
     */
    start() {
        // Cancel any existing loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Handle first audio interaction
        this.audioManager.handleFirstInteraction();

        // Reset state
        this.currentState = STATE.PLAYING;
        this.currentLevelIdx = 0;

        // Reset managers
        this.scoreManager.reset();

        // Reset systems
        this.particleSystem.clear();

        // Reset entities
        this.player.reset();
        this.player.setLevel(0);
        this.obstacles.reset();
        this.obstacles.setLevel(0);
        this.backgroundSystem.setLevel(0);

        // Update UI
        this.uiManager.showPlayingUI();
        this.uiManager.updateScore(0);
        this.uiManager.updateLevel(0);

        // Initial jump
        this.player.jump();

        // Start loop
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    /**
     * Handle game over
     */
    gameOver() {
        if (this.currentState === STATE.GAMEOVER) return;

        this.currentState = STATE.GAMEOVER;

        // Check high score
        this.scoreManager.checkHighScore();

        // Explosion particles
        const config = getLevelConfig(this.currentLevelIdx);
        this.particleSystem.createExplosion(this.player.x, this.player.y, config.color);

        // Show game over UI
        this.uiManager.showGameOver(
            this.scoreManager.getScore(),
            this.scoreManager.getHighScore()
        );
    }

    /**
     * Main game loop
     * @param {number} timestamp - Current timestamp
     */
    loop(timestamp) {
        // Calculate delta time (normalized to 60fps)
        let dt = (timestamp - this.lastTime) / (1000 / 60);
        if (dt > 4) dt = 4; // Cap to prevent physics explosion
        if (dt < 0) dt = 0;

        this.lastTime = timestamp;

        // Clear canvas
        this.canvas.clear();

        // Update and render background
        this.backgroundSystem.update(this.currentState === STATE.PLAYING);
        this.backgroundSystem.draw(this.ctx);

        // Update game if playing
        if (this.currentState === STATE.PLAYING) {
            this.player.update(dt);
            this.obstacles.update(dt, this.player.getHitbox(), this.player.x);
        }

        // Render obstacles
        this.obstacles.draw(this.ctx);

        // Render particles
        this.particleSystem.updateAndDraw(this.ctx);

        // Render player (unless game over)
        if (this.currentState !== STATE.GAMEOVER) {
            this.player.draw(this.ctx);
        }

        // Continue loop if playing or particles still visible
        if (this.currentState === STATE.PLAYING ||
            (this.currentState === STATE.GAMEOVER && this.particleSystem.hasActiveParticles())) {
            this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
        }
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.canvas.destroy();
        this.inputManager.destroy();
        EventBus.clear();
    }
}
