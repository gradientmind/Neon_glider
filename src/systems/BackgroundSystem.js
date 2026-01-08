/**
 * BackgroundSystem - Stars, gradient background, and tech grid rendering
 */

import { getLevelConfig } from '../config/LevelConfig.js';

const STAR_COUNT = 80;

export class BackgroundSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.stars = [];
        this.currentLevelIdx = 0;
        this.frames = 0;

        // Initialize stars
        this._initStars();
    }

    /**
     * Initialize stars with random positions
     * @private
     */
    _initStars() {
        this.stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2,
                speed: Math.random() * 0.8 + 0.2
            });
        }
    }

    /**
     * Set current level for colors
     * @param {number} levelIdx - Current level index
     */
    setLevel(levelIdx) {
        this.currentLevelIdx = levelIdx;
    }

    /**
     * Update background state
     * @param {boolean} isPlaying - Whether game is actively playing
     */
    update(isPlaying) {
        this.frames++;

        if (isPlaying) {
            const config = getLevelConfig(this.currentLevelIdx);

            for (const star of this.stars) {
                star.x -= star.speed + (config.speed * 0.05);
                if (star.x < 0) {
                    star.x = this.canvas.width;
                }
            }
        }
    }

    /**
     * Render background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        const config = getLevelConfig(this.currentLevelIdx);

        // Gradient Background
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, config.bgGradient[0]);
        gradient.addColorStop(1, config.bgGradient[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Stars
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        for (const star of this.stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Tech Grid (Floor/Ceiling lines)
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;

        const gridH = 150;

        // Ceiling
        ctx.beginPath();
        ctx.moveTo(0, gridH);
        ctx.lineTo(this.canvas.width, gridH);
        ctx.stroke();

        // Floor
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height - gridH);
        ctx.lineTo(this.canvas.width, this.canvas.height - gridH);
        ctx.stroke();
    }

    /**
     * Reset stars on resize
     */
    reset() {
        this._initStars();
    }
}
